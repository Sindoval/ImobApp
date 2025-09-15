import { db } from "@/app/_lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";


export async function POST(req: NextRequest) {
  const { email, token, newPassword } = await req.json();

  const record = await db.passwordResetToken.findFirst({
    where: { email, token },
  });

  if (!record) {
    return NextResponse.json({ error: "Token inválido " }, { status: 400 });
  }

  if (record.expiresAt < new Date()) {
    return NextResponse.json({ error: "Token expirado" }, { status: 400 });
  }

  //Atualizar senha
  const hash = await bcrypt.hash(newPassword, 10);
  await db.usuario.update({
    where: { email },
    data: { senhaHash: hash }
  });

  // Apagar Token
  await db.passwordResetToken.delete({
    where: { id: record.id }
  });

  return NextResponse.json({ message: "Senha atualizada com sucesso!" })
}