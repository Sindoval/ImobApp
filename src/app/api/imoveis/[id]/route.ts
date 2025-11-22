import { db } from "@/app/_lib/prisma";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";


interface UpdateImovelData {
  endereco?: string
  descricao?: string
  valorCompra?: number
  valorVenda?: number
  status?: string
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const dataToUpdate: UpdateImovelData = await req.json();

    if (Object.keys(dataToUpdate).length === 0) {
      return NextResponse.json(
        { error: "O corpo da requisição está vazio. Forneça dados para atualização." },
        { status: 400 } // Bad Request
      );
    }

    const existingImovel = await db.imovel.findUnique({
      where: { id }
    });

    if (!existingImovel) {
      return NextResponse.json(
        { error: "Imóvel não encontrado" },
        { status: 404 }
      );
    }

    const updatedImovel = await db.imovel.update({
      where: { id },
      data: dataToUpdate,
    });

    revalidatePath("/imoveis");

    return NextResponse.json(updatedImovel);

  } catch (error) {
    console.error("Erro no PATCH:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor ao tentar atualizar imóvel" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const imovel = await db.imovel.findUnique({
      where: { id }
    });

    if (!imovel) {
      return NextResponse.json(
        { error: "Imóvel não encontrado" },
        { status: 404 }
      );
    }

    await db.imovel.delete({
      where: { id }
    });

    revalidatePath("/imoveis");
    return NextResponse.json({ message: "Imóvel removido com sucesso" })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Erro interno no servidor ao tentar remover imóvel" }, { status: 500 });
  }
}