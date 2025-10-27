import { db } from "@/app/_lib/prisma";
import { error } from "console";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";


export async function PUT(req: NextRequest, { params } : {params: {id: string }} ) {
    try {
        const { id } = params;
        
        const itemEstoque = await db.estoque.findUnique({
            where: { id }
        })

        if (!itemEstoque) {
            return NextResponse.json(
                { error: "Item do Estoque não encontrado"},
                {status: 404 }
            );
        }


        const body = await req.json();
        const { quantidade } = body;

        if (!quantidade || isNaN(quantidade)) {
            return NextResponse.json(
                {error: "Quantidade inválida"},
                { status: 400 }
            )
        }


        const itemAtualizado = await db.estoque.update({
            where: { id },
            data: { quantidade }
        });

        return NextResponse.json(itemAtualizado, {status: 200 , headers: {
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  },} );

    } catch (error) {
        return NextResponse.json(
      { error: "Erro ao atualizar o item do estoque" },
      { status: 500 }
    );
    }
}

export async function GET(_req: NextRequest, { params } : {params: {id: string}}) {
    const { id } = params;

    try {
        const itemEstoque = await db.estoque.findUnique({
            where: { id }
        });

        if (!itemEstoque) {
            return NextResponse.json(
                { error: "Item do Estoque não encontrado"},
                {status: 404 }
            );
        }

        return NextResponse.json(itemEstoque, { status: 200});
    }
        
    catch (error) {
        return NextResponse.json(
            { error: "Erro ao buscar item do estoque" },
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

    const itemEstoque = await db.estoque.findUnique({
      where: { id }
    });

    if (!itemEstoque) {
      return NextResponse.json(
        { error: "Item do Estoque não encontrado" },
        { status: 404 }
      );
    }

    await db.estoque.delete({
      where: { id }
    });

    revalidatePath("/estoque");
    return NextResponse.json({ message: "Item do Estoque removido com sucesso" })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Erro interno no servidor ao tentar remover item do Estoque" }, { status: 500 });
  }
}