import { db } from "@/app/_lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


export async function POST(req: NextRequest) {
  const { email, senha } = await req.json();

  const user = await db.usuario.findUnique({ where: { email }, include: { role: true } });

  if (!user) return NextResponse.json({ error: "Usuário ou senha inválidos" }, { status: 401 });
  console.log(user);

  const isPasswordValid = await bcrypt.compare(senha, user.senhaHash);
  if (!isPasswordValid) return NextResponse.json({ error: "Usuário ou senha inválidos" }, { status: 401 });

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role.nome },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );
  console.log({ token: token });

  const response = NextResponse.json({ message: "Login bem-sucedido" });
  response.cookies.set({
    name: "token",
    value: token,
    httpOnly: true,
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 dias
    sameSite: "lax",

  });

  return response;
}