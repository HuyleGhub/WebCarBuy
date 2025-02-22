import { getSession } from '@/app/lib/auth';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

const MAX_VND_AMOUNT = 200000000; // 200 million VND

const validateTotalAmount = (cartItems: any[]) => {
  const totalVND = cartItems.reduce(
    (sum, item) => sum + (item.xe.GiaXe * item.SoLuong),
    0
  );
  
  if (totalVND > MAX_VND_AMOUNT) {
    throw new Error(`Total amount (${new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(totalVND)}) exceeds maximum limit of ${new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(MAX_VND_AMOUNT)}`);
  }
  
  return totalVND;
};

export async function POST(req: Request) {
  try {
    const session = await getSession();
    const { cartItems } = await req.json();

    const totalAmount = validateTotalAmount(cartItems);
    const amountInUSD = Math.round((totalAmount / 24000) * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInUSD,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        userId: session.idUsers,
        cartItems: JSON.stringify(cartItems.map((item: any) => ({
          idGioHang: item.idGioHang,
          idXe: item.idXe,
          SoLuong: item.SoLuong,
          originalPrice: item.xe.GiaXe
        }))),
        conversion_rate: '24000',
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error: any) {
    console.error('Stripe payment error:', error);
    return NextResponse.json(
      { error: error.message || 'Error creating payment' },
      { status: 500 }
    );
  }
}
