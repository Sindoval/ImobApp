import { db } from "@/app/_lib/prisma";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";


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