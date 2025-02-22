import { getSession } from '@/app/lib/auth';
import prisma from '@/prisma/client';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Prisma } from '@prisma/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

export async function POST(req: Request) {
  try {
    const session = await getSession();
    const body = await req.json();
    console.log("Received body:", body);

    const { cartItems, stripeSessionId, paymentMethod } = body;

    if (stripeSessionId && !cartItems) {
      try {
        const paymentIntent = await stripe.paymentIntents.retrieve(stripeSessionId);
        console.log("Retrieved payment intent:", paymentIntent);
        
        const existingPayment = await prisma.thanhToan.findFirst({
          where: {
            TrangThai: `STRIPE:${stripeSessionId}`
          }
        });
        
        if (existingPayment) {
          console.log("Payment already processed for this payment intent:", existingPayment);
          return NextResponse.json({ 
            success: true, 
            message: "Payment already processed", 
            data: { existingPayment } 
          });
        }
        
        if (paymentIntent.metadata?.cartItems) {
          const parsedCartItems = JSON.parse(paymentIntent.metadata.cartItems);
          console.log("Parsed cart items from metadata:", parsedCartItems);
          
          const userId = typeof session.idUsers === 'string' ? parseInt(session.idUsers, 10) : session.idUsers;
          return await processOrder(parsedCartItems, paymentMethod || 'STRIPE', userId, stripeSessionId);
        } else {
          console.error("No cart items found in payment intent metadata:", paymentIntent.metadata);
          throw new Error("No cart items found in payment metadata");
        }
      } catch (error) {
        console.error('Error retrieving or processing payment intent:', error);
        return NextResponse.json({ 
          error: "Failed to retrieve or process payment details",
          details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
      }
    }

    if (cartItems && Array.isArray(cartItems)) {
      const userId = typeof session.idUsers === 'string' ? parseInt(session.idUsers, 10) : session.idUsers;
      return await processOrder(cartItems, paymentMethod, userId);
    }

    return NextResponse.json({ error: "Invalid request: either stripeSessionId or cartItems required" }, { status: 400 });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error during checkout',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

async function processOrder(cartItems: any[], paymentMethod: string, userId: number, stripeSessionId?: string) {
  if (!Array.isArray(cartItems)) {
    console.error("cartItems is not an array:", cartItems);
    return NextResponse.json({ error: "Invalid cart items data" }, { status: 400 });
  }

  try {
    if (stripeSessionId) {
      const existingPayment = await prisma.thanhToan.findFirst({
        where: {
          TrangThai: `STRIPE:${stripeSessionId}`
        },
        include: {
          donHang: true
        }
      });
      
      if (existingPayment) {
        console.log("Found existing payment for this session:", existingPayment);
        return NextResponse.json({ 
          success: true, 
          message: "Payment already processed", 
          data: { existingPayment } 
        });
      }
    }

    const result = await prisma.$transaction(async (prisma) => {
      // Fetch full vehicle details for each cart item first
      const cartItemsWithDetails = await Promise.all(
        cartItems.map(async (item) => {
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

      const allOrders = [];
      const allPayments = [];
      const allDeliverySchedules = [];
      const allOrderDetails = [];
      
      const totalAmount = cartItemsWithDetails.reduce((sum, item) => {
        return sum + (Number(item.xe.GiaXe) * item.SoLuong);
      }, 0);
      
      const order = await prisma.donHang.create({
        data: {
          idKhachHang: userId,
          NgayDatHang: new Date(),
          TrangThaiDonHang: 'Chờ xác nhận',
          TongTien: totalAmount,
        },
      });
      allOrders.push(order);

      for (const item of cartItemsWithDetails) {
        try {
          if (!item.idXe || !item.SoLuong || !item.xe?.GiaXe) {
            console.error("Invalid item data:", item);
            continue;
          }

          if (item.xe.TrangThai === 'Đã đặt hàng') {
            console.warn(`Vehicle with ID ${item.idXe} is already ordered`);
            continue;
          }

          const orderDetail = await prisma.chiTietDonHang.create({
            data: {
              idDonHang: order.idDonHang,
              idXe: item.idXe,
              SoLuong: item.SoLuong,
              DonGia: Number(item.xe.GiaXe),
            },
          });
          allOrderDetails.push(orderDetail);
          
          await prisma.xe.update({
            where: {
              idXe: item.idXe,
            },
            data: {
              TrangThai: 'Đã đặt hàng',
            },
          });

          const deliverySchedule = await prisma.lichGiaoXe.create({
            data: {
              idDonHang: order.idDonHang,
              idXe: item.idXe,
              idKhachHang: userId,
              NgayGiao: await calculateDeliveryDate(),
              TrangThai: 'Chờ giao',
            },
          });
          allDeliverySchedules.push(deliverySchedule);
        } catch (itemError) {
          console.error(`Error processing item with idXe ${item.idXe}:`, itemError);
          throw itemError;
        }
      }

      const payment = await prisma.thanhToan.create({
        data: {
          idDonHang: order.idDonHang,
          PhuongThuc: paymentMethod,
          NgayThanhToan: new Date(),
          TrangThai: stripeSessionId ? `STRIPE:${stripeSessionId}` : 'Thành công',
        },
      });
      allPayments.push(payment);

      for (const item of cartItems) {
        if (item.idGioHang) {
          try {
            await prisma.gioHang.delete({
              where: {
                idGioHang: item.idGioHang,
              },
            });
          } catch (err) {
            console.warn(`Item with idGioHang ${item.idGioHang} might have been already deleted`);
          }
        }
      }

      return {
        orders: allOrders,
        orderDetails: allOrderDetails,
        payments: allPayments,
        deliverySchedules: allDeliverySchedules,
      };
    });

    return NextResponse.json({ success: true, data: result });
  } catch (txError) {
    console.error('Transaction error:', txError);
    
    let errorMessage = 'Error processing order';
    let errorDetails = '';
    
    if (txError instanceof Prisma.PrismaClientKnownRequestError) {
      errorMessage = `Database error: ${txError.message}`;
      errorDetails = JSON.stringify({
        code: txError.code,
        meta: txError.meta,
        model: (txError.meta as any)?.modelName || 'unknown',
      });
    } else if (txError instanceof Error) {
      errorMessage = txError.message;
      errorDetails = txError.stack || '';
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: errorDetails
      },
      { status: 500 }
    );
  }
}

async function calculateDeliveryDate(): Promise<Date> {
  const orderDate = new Date();
  const earliestDeliveryDate = new Date(orderDate);
  earliestDeliveryDate.setDate(orderDate.getDate() + 3);

  const maxDeliveryDate = new Date(orderDate);
  maxDeliveryDate.setDate(orderDate.getDate() + 6);

  const deliveryDate = new Date(
    earliestDeliveryDate.getTime() +
      Math.random() * (maxDeliveryDate.getTime() - earliestDeliveryDate.getTime())
  );

  deliveryDate.setHours(8 + Math.floor(Math.random() * 10), Math.floor(Math.random() * 60), 0, 0);
  return deliveryDate;
}