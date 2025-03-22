// File: app/api/danh-gia/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { getSession } from "@/app/lib/auth";


// GET all reviews or filter by specific parameters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idUser = searchParams.get("idUser");
    const idXe = searchParams.get("idXe");
    const idLichHen = searchParams.get("idLichHen");

    // Build the query filters
    const filter: any = {};

    if (idUser) filter.idUser = parseInt(idUser);
    if (idXe) filter.idXe = parseInt(idXe);
    if (idLichHen) filter.idLichHen = parseInt(idLichHen);

    // Get all reviews with related data included
    const danhGias = await prisma.danhGiaTraiNghiem.findMany({
      where: filter,
      include: {
        user: {
          select: {
            Hoten: true,
            Email: true,
          },
        },
        xe: {
          select: {
            TenXe: true,
            MauSac: true,
            HinhAnh: true,
          },
        },
        lichHen: {
          select: {
            NgayHen: true,
            GioHen: true,
            DiaDiem: true,
          },
        },
      },
      orderBy: {
        NgayDanhGia: "desc",
      },
    });

    return NextResponse.json(danhGias);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST new review
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    
  

    const data = await request.json();
    const { idLichHen, SoSao, NoiDung, } = data;

    // Get user ID from session
   

    // Get xe information from LichHen
    const lichHen = await prisma.lichHen.findUnique({
      where: {
        idLichHen,
      },
      select: {
        idXe: true,
      },
    });

    if (!lichHen || !lichHen.idXe) {
      return NextResponse.json(
        { error: "Appointment not found or no car associated" },
        { status: 404 }
      );
    }

    // Check if review already exists
    const existingReview = await prisma.danhGiaTraiNghiem.findFirst({
      where: {
        idLichHen,
        idUser: session.idUsers,
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: "You have already reviewed this test drive" },
        { status: 400 }
      );
    }

    // Create new review
    const newDanhGia = await prisma.danhGiaTraiNghiem.create({
      data: {
        idLichHen,
        idUser: session.idUsers,
        idXe: lichHen.idXe,
        SoSao,
        NoiDung,
        NgayDanhGia: new Date(),
      },
    });


    return NextResponse.json(newDanhGia, { status: 201 });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}