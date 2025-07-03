//api/checkout
import { getSession } from '@/app/lib/auth';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/prisma/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

const ALLOWED_DEPOSIT_PERCENTAGES = [0.1, 0.2, 0.3, 0.4, 0.5, 1.0]; // 10%, 20%, 30%, 40%, 50%, 100%
const MAX_USD_AMOUNT = 999999; // Maximum amount allowed by Stripe in USD
const USD_TO_VND_RATE = 24000; // Conversion rate

const validateTotalAmount = async (vehicles: any[], depositPercentage: number) => {
  const vehiclesWithDetails = await Promise.all(
    vehicles.map(async (item) => {
      const vehicle = await prisma.xe.findUnique({
        where: { idXe: item.idXe }
      });
      
      if (!vehicle) {
        throw new Error(`Vehicle with ID ${item.idXe} not found`);
      }
      
      return {
        ...item,
        xe: vehicle
      };
    })
  );

  const totalVND = vehiclesWithDetails.reduce(
    (sum, item) => sum + (Number(item.xe.GiaXe) * item.SoLuong),
    0
  );
  
  const depositAmount = totalVND * depositPercentage;
  const depositInUSD = depositAmount / USD_TO_VND_RATE;
  
  return { 
    totalVND, 
    depositAmount, 
    depositInUSD,
    vehiclesWithDetails 
  };
};

export async function POST(req: Request) {
  try {
    const session = await getSession();
    const { vehicles, depositPercentage = 0.2, pickupSchedule } = await req.json();

    // Validate session and vehicles
    if (!session || !session.idUsers) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    if (!vehicles || !Array.isArray(vehicles) || vehicles.length === 0) {
      return NextResponse.json(
        { error: 'Valid vehicle selection required' },
        { status: 400 }
      );
    }

    // Validate deposit percentage
    if (!ALLOWED_DEPOSIT_PERCENTAGES.includes(depositPercentage)) {
      return NextResponse.json(
        { 
          error: 'Invalid deposit percentage', 
          allowedPercentages: ALLOWED_DEPOSIT_PERCENTAGES.map(p => p * 100) 
        },
        { status: 400 }
      );
    }

    // Validate vehicles and calculate amounts
    const { 
      totalVND, 
      depositAmount, 
      depositInUSD, 
      vehiclesWithDetails 
    } = await validateTotalAmount(vehicles, depositPercentage);
    
    // Adjust deposit amount if it exceeds Stripe's maximum
    const cappedDepositInUSD = Math.min(
      Math.round(depositInUSD * 100), 
      MAX_USD_AMOUNT * 100
    );

    // Create Stripe payment intent with pickup schedule in metadata
    const paymentIntent = await stripe.paymentIntents.create({
      amount: cappedDepositInUSD,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        userId: session.idUsers,
        vehicles: JSON.stringify(vehiclesWithDetails.map((item: any) => ({
          idXe: item.idXe,
          SoLuong: item.SoLuong,
          originalPrice: item.xe.GiaXe
        }))),
        conversion_rate: String(USD_TO_VND_RATE),
        deposit_percentage: String(depositPercentage),
        total_amount_vnd: String(totalVND),
        deposit_amount_vnd: String(depositAmount),
        capped_amount: cappedDepositInUSD > MAX_USD_AMOUNT * 100 ? 'true' : 'false',
        // Add pickup schedule to metadata if provided
        pickup_schedule: pickupSchedule ? JSON.stringify(pickupSchedule) : ''
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      depositAmount,
      totalAmount: totalVND,
      depositPercentage: depositPercentage * 100,
      cappedAmount: cappedDepositInUSD > MAX_USD_AMOUNT * 100
    });
  } catch (error: any) {
    console.error('Stripe payment error:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Error creating payment intent for deposit',
        details: error.stack || 'No additional details' 
      },
      { status: 500 }
    );
  }
}