import { db } from "@/app/_lib/prisma";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { nome, descricao, unidade } = await req.json();

  try {
    const produto = await db.produto.create({
      data: {
        nome,
        descricao,
        unidade
      }
    });
    revalidatePath("/estoque");
    return NextResponse.json({ produto }, { status: 201 })
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}
