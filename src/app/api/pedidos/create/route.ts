import { db } from "@/app/_lib/prisma";
import { PedidoItem } from "@/generated/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      descricao,
      doEstoque,
      fornecedorId,
      imovelId,
      criadoPorId,
      itens,
    } = body;

    // validações básicas
    if (!descricao || !Array.isArray(itens) || itens.length === 0) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }

    const pedido = await db.pedido.create({
      data: {
        descricao,
        status: "Pendente",
        diretoParaImovel: doEstoque,
        fornecedorId: doEstoque ? null : fornecedorId,
        imovelId,
        criadoPorId,

        itens: {
          create: itens.map((i: PedidoItem) => ({
            nome: i.nome,
            quantidade: i.quantidade,
            precoUnit: i.precoUnit,
          })),
        },
      },
      include: { itens: true },
    });

    return NextResponse.json(pedido, { status: 201 });

  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: "Erro ao criar pedido" },
      { status: 500 }
    );
  }
}
