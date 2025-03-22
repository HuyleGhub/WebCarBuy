import { PrismaClient } from '@prisma/client';
import { NextResponse, NextRequest } from 'next/server';

// Initialize Prisma Client
const prisma = new PrismaClient();

export async function GET() {
  try {
    // Fetch vehicles and include related LoaiXe data
    const vehicles = await prisma.xe.findMany({
      include: {
        loaiXe: true, 
      },
    });

    return NextResponse.json(vehicles);
  } catch (error) {
    // Handle any errors that occur during the fetch
    console.error('Error fetching vehicles:', error);
    return NextResponse.json({ error: 'Failed to fetch vehicles' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Check if this is a request for vehicle data
    if (body.action === 'getVehicles') {
      const vehicles = await prisma.xe.findMany({
        include: {
          loaiXe: true,
        },
      });
      
      return NextResponse.json({
        success: true,
        data: vehicles,
      });
    }
    
    // You can add more actions based on Coze's needs
    
    return NextResponse.json({
      success: false,
      message: 'Unknown action',
    });
  } catch (error) {
    console.error('Error in Coze webhook:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}