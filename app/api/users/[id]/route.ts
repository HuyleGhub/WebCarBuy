import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, {params}: {params: {id: string}}){
    try {
        const idUser = parseInt(params.id);
        const deleteUser = await prisma.users.delete({
            where: {
                idUsers: idUser
            }
        });
        return NextResponse.json({deleteUser, message: "Delete user successfully"}, {status: 200});
    } catch (error: any) {
        return NextResponse.json({message: "Xóa Không Thành Công"}, {status: 500});
    }
}