"use server"

import { db } from "../_lib/prisma"

export async function getPedidos() {
  try {
    const pedidos = await db.pedido.findMany(
      {
        include: { criadoPor: true, fornecedor: true, imovel: true, itens: true }
      }
    );
    return pedidos;
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao buscar Pedidos");
  }
}

export async function getPedidosByImovel(imovelId: string) {
  try {
    const pedido = await db.pedido.findMany(
      {
        where: { imovelId },
        include: {
          criadoPor: true,
          imovel: true,
          itens: true,
          fornecedor: true,
        },
        orderBy: { createdAt: "desc" }
      }
    );
    return pedido;
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao buscar Pedido");
  }
}
