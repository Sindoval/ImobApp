import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { db } from "@/app/_lib/prisma";

export async function POST(req: NextRequest) {
  const { nome, email, senha, role } = await req.json();

  const hashedPassword = await bcrypt.hash(senha, 10);

  const roleDb = await db.role.findUnique({ where: { nome: role } });

  if (!roleDb) return NextResponse.json({ error: "Role não encontrada" }, { status: 400 });

  const user = await db.usuario.create({
    data: {
      nome,
      email,
      senhaHash: hashedPassword,
      roleId: roleDb.id
    },
  });

  return NextResponse.json({ user });
}