//api/thanhtoan
import { getSession } from '@/app/lib/auth';
import prisma from '@/prisma/client';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Prisma } from '@prisma/client';
import { createNotification } from '@/lib/create-notification';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

const ALLOWED_DEPOSIT_PERCENTAGES = [0.1, 0.2, 0.3, 0.4, 0.5, 1.0]; // 10%, 20%, 30%, 40%, 50%, 100%
const MAX_USD_AMOUNT = 999999; // Maximum amount allowed by Stripe in USD
const USD_TO_VND_RATE = 24000; // Conversion rate

// Refactored method to validate total amount
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

// Helper function to calculate pickup date
async function calculatePickupDate(): Promise<Date> {
  const depositDate = new Date();
  const earliestPickupDate = new Date(depositDate);
  earliestPickupDate.setDate(depositDate.getDate() + 2);

  const maxPickupDate = new Date(depositDate);
  maxPickupDate.setDate(depositDate.getDate() + 5);

  const pickupDate = new Date(
    earliestPickupDate.getTime() +
      Math.random() * (maxPickupDate.getTime() - earliestPickupDate.getTime())
  );

  return pickupDate;
}

// Helper function to calculate pickup time
async function calculatePickupTime(): Promise<Date> {
  const pickupTime = new Date();
  // Set hours between 8AM and 6PM
  pickupTime.setHours(8 + Math.floor(Math.random() * 10), Math.floor(Math.random() * 60), 0, 0);
  return pickupTime;
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    const body = await req.json();
    const { vehicles, stripeSessionId, paymentMethod, depositPercentage = 0.2 } = body;

    // Validate session
    if (stripeSessionId && !vehicles) {
      try {
        const paymentIntent = await stripe.paymentIntents.retrieve(stripeSessionId);
        
        const existingPayment = await prisma.thanhToan.findFirst({
          where: { TrangThai: `STRIPE:${stripeSessionId}` }
        });
        
        if (existingPayment) {
          return NextResponse.json({ 
            success: true, 
            message: "Payment already processed", 
            data: { existingPayment } 
          });
        }
        
        if (paymentIntent.metadata?.vehicles) {
          const parsedVehicles = JSON.parse(paymentIntent.metadata.vehicles);
          const userId = typeof session.idUsers === 'string' 
            ? parseInt(session.idUsers, 10) 
            : session.idUsers;
          
          // Extract pickup schedule from metadata if it exists
          let pickupSchedule;
          if (paymentIntent.metadata?.pickup_schedule) {
            try {
              pickupSchedule = JSON.parse(paymentIntent.metadata.pickup_schedule);
            } catch (e) {
              console.error('Error parsing pickup schedule:', e);
            }
          }
          
          return await processDeposit(
            parsedVehicles, 
            paymentMethod || 'STRIPE', 
            userId, 
            stripeSessionId, 
            Number(paymentIntent.metadata.deposit_percentage),
            pickupSchedule  // Pass the parsed pickup schedule
          );
        } else {
          throw new Error("No vehicles found in payment metadata");
        }
      } catch (error) {
        console.error('Payment intent processing error:', error);
        return NextResponse.json({ 
          error: "Failed to retrieve or process payment details",
          details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
      }
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

    // Process deposit with vehicle data
    if (vehicles && Array.isArray(vehicles) && vehicles.length > 0) {
      const userId = typeof session.idUsers === 'string' 
        ? parseInt(session.idUsers, 10) 
        : session.idUsers;

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

      // Create Stripe payment intent
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
          capped_amount: cappedDepositInUSD > MAX_USD_AMOUNT * 100 ? 'true' : 'false'
        },
      });

      return NextResponse.json({
        clientSecret: paymentIntent.client_secret,
        depositAmount,
        totalAmount: totalVND,
        depositPercentage: depositPercentage * 100,
        cappedAmount: cappedDepositInUSD > MAX_USD_AMOUNT * 100
      });
    }

    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  } catch (error) {
    console.error('Deposit processing error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

async function processDeposit(
  vehicles: any[], 
  paymentMethod: string, 
  userId: number, 
  stripeSessionId?: string, 
  depositPercentage: number = 0.2,
  pickupSchedule?: {
    NgayLayXe: string;
    GioHenLayXe: string;
    DiaDiem: string;
  }
) {
  try {
    const result = await prisma.$transaction(async (prisma) => {
      const { totalVND, vehiclesWithDetails } = await validateTotalAmount(vehicles, depositPercentage);

      // Check for existing payment to prevent duplicate processing
      if (stripeSessionId) {
        const existingPayment = await prisma.thanhToan.findFirst({
          where: { TrangThai: `STRIPE:${stripeSessionId}` }
        });
        
        if (existingPayment) {
          return { 
            success: true, 
            message: "Payment already processed", 
            data: { existingPayment } 
          };
        }
      }

      // Create deposit record
      const deposit = await prisma.datCoc.create({
        data: {
          idKhachHang: userId,
          idXe: vehiclesWithDetails[0].idXe,
          NgayDat: new Date(),
          SotienDat: totalVND * depositPercentage,
          TrangThaiDat: 'Chờ xác nhận',
        },
      });

      // Create deposit details and update vehicle statuses
      const depositDetails = await Promise.all(
        vehiclesWithDetails.map(async (item, index) => {
          // Check vehicle availability
          const vehicle = await prisma.xe.findUnique({
            where: { idXe: item.idXe }
          });
      
          if (!vehicle) {
            throw new Error(`Vehicle ${item.idXe} not found`);
          }
      
          if (vehicle.TrangThai === 'Đã đặt cọc') {
            throw new Error(`Vehicle ${item.idXe} is already reserved`);
          }
      
          // Check if this vehicle is already in a ChiTietDatCoc record
          const existingRecord = await prisma.chiTietDatCoc.findFirst({
            where: { idXe: parseInt(item.idXe) }
          });
      
          let chiTietDatCoc;
      
          if (existingRecord) {
            // If exists, update it to point to our new deposit
            chiTietDatCoc = await prisma.chiTietDatCoc.update({
              where: { idChiTietDatCoc: existingRecord.idChiTietDatCoc },
              data: {
                idDatCoc: deposit.idDatCoc,
                SoLuong: 1,
                DonGia: vehicle.GiaXe || 0
              }
            });
          } else {
            // If it doesn't exist, create a new record
            chiTietDatCoc = await prisma.chiTietDatCoc.create({
              data: {
                idDatCoc: deposit.idDatCoc,
                idXe: parseInt(item.idXe),
                SoLuong: 1,
                DonGia: vehicle.GiaXe || 0
              }
            });
          }
      
          // Update vehicle status
          await prisma.xe.update({
            where: { idXe: item.idXe },
            data: { TrangThai: 'Đã đặt cọc' }
          });
      
          // Create pickup schedule
          await prisma.lichHenLayXe.create({
            data: {
              idDatCoc: deposit.idDatCoc,
              idXe: item.idXe,
              idKhachHang: userId,
              NgayLayXe: pickupSchedule?.NgayLayXe ? new Date(pickupSchedule.NgayLayXe) : await calculatePickupDate(),
              GioHenLayXe: pickupSchedule?.GioHenLayXe,
              DiaDiem: pickupSchedule?.DiaDiem
            }
          });
      
          return chiTietDatCoc;
        })
      );

      // Create payment record
      const payment = await prisma.thanhToan.create({
        data: {
          idDatCoc: deposit.idDatCoc,
          PhuongThuc: paymentMethod,
          NgayThanhToan: new Date(),
          TrangThai: stripeSessionId ? `STRIPE:${stripeSessionId}` : 'Thành công'
        }
      });

      // Notifications for customer
      await createNotification({
        userId,
        type: 'deposit',
        message: `Đặt cọc #${deposit.idDatCoc} thành công. Tổng tiền: ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalVND * depositPercentage)}`
      });

      // Notifications for staff
      const staffMembers = await prisma.users.findMany({
        where: { idRole: 2 }
      });

      await Promise.all(staffMembers.map(staff => 
        createNotification({
          userId: staff.idUsers,
          type: 'deposit',
          message: `Đặt cọc mới #${deposit.idDatCoc} cần xử lý`
        })
      ));

      return { 
        deposit, 
        depositDetails, 
        payment 
      };
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Deposit processing transaction error:', error);
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Lỗi không xác định trong quá trình xử lý đặt cọc';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}