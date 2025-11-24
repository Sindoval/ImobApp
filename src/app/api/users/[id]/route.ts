import { db } from "@/app/_lib/prisma"
import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"


interface UpdatePerfilData {
  id?: string
  nome?: string
  email?: string
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const dataToUpdate: UpdatePerfilData = await req.json();

    if (Object.keys(dataToUpdate).length === 0) {
      return NextResponse.json(
        { error: "O corpo da requisição está vazio. Forneça dados para atualização." },
        { status: 400 } // Bad Request
      );
    }

    const existinPerfil = await db.usuario.findUnique({
      where: { id }
    });

    if (!existinPerfil) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    const updatedPerfil = await db.usuario.update({
      where: { id },
      data: dataToUpdate,
    });

    revalidatePath("/perfil");

    return NextResponse.json(updatedPerfil);

  } catch (error) {
    console.error("Erro no PATCH:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor ao tentar atualizar Usuário" },
      { status: 500 }
    );
  }
}