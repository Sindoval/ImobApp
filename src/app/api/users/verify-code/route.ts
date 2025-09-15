import { db } from "@/app/_lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
  const { email, token } = await req.json();

  try {
    const record = await db.passwordResetToken.findFirst({
      where: { email, token },
    });

    if (!record) {
      return NextResponse.json({ error: "Código inválido" }, { status: 400 });
    }

    if (record.expiresAt < new Date()) {
      return NextResponse.json({ error: "Código expirado" }, { status: 400 });
    }

    return NextResponse.json({ message: "Código válido" });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }

}