import { db } from "@/app/_lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { transporter } from "../../../../nodemailer";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  const user = await db.usuario.findUnique({ where: { email } });

  if (!user) {
    return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
  }

  //TOKEN
  const token = Math.floor(10000000 + Math.random() * 90000000).toString();

  await db.passwordResetToken.create({
    data: {
      email,
      token,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 MIN
    },
  });

  //Tranporter
  await transporter.sendMail({
    from: '"Projeto ADS" <projeto@projetoads.com.br>',
    to: email,
    subject: "Recuperação de senha",
    html: `<p>Olá, ${user.nome}!</p>
           <p>Use este código para redefinir sua senha:</p>
           <h2>${token}</h2>
           <p>Esse código expira em 15 minutos.</p>`,
  });

  return NextResponse.json({ message: "E-mail de recuperação enviado!" })
}