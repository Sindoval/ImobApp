import { db } from "@/app/_lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcryptjs";

interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const data: ChangePasswordPayload = await req.json();

    if (!data.currentPassword || !data.newPassword) {
      return NextResponse.json(
        { error: "Senha atual e nova senha são obrigatórias." },
        { status: 400 }
      );
    }

    const user = await db.usuario.findUnique({
      where: { id },
      select: {
        senhaHash: true // Seleciona apenas o hash para segurança
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado." },
        { status: 404 }
      );
    }

    const isPasswordValid = await bcrypt.compare(
      data.currentPassword,
      user.senhaHash
    );

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "A senha atual está incorreta." },
        { status: 401 } // Unauthorized
      );
    }

    const newPasswordHash = await bcrypt.hash(data.newPassword, 10);

    await db.usuario.update({
      where: { id },
      data: { senhaHash: newPasswordHash },
    });

    return NextResponse.json({ message: "Senha atualizada com sucesso." });

  } catch (error) {
    console.error("Erro ao alterar senha:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor." },
      { status: 500 }
    );
  }
}