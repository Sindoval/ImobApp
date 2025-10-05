import { db } from "@/app/_lib/prisma";
import { NextResponse } from "next/server";


export async function GET() {
  try {
    const imoveis = await db.imovel.findMany();

    return NextResponse.json(imoveis);

  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}
