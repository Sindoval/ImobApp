import { db } from "@/app/_lib/prisma";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { produtoId, quantidade } = await req.json();

  try {
    const estoque = await db.estoque.create({
      data: {
        produtoId,
        quantidade
      },
      include: {
        produto: true
      }
    });
    revalidatePath("/estoque");
    return NextResponse.json({ estoque }, { status: 201 })
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}
