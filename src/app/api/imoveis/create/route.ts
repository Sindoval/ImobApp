import { db } from "@/app/_lib/prisma";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
  const { endereco, valorCompra, valorVenda, status, engenheiroId } = await req.json();

  try {
    const imovel = await db.imovel.create({
      data: {
        endereco,
        valorCompra,
        valorVenda,
        status,
        engenheiroId,
      }
    });
    revalidatePath("/imoveis");
    return NextResponse.json({ imovel }, { status: 201 })
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}
