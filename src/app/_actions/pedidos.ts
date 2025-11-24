"use server"

import { db } from "../_lib/prisma"

export async function getPedidos() {
  try {
    const pedidos = await db.pedido.findMany(
      {
        include: { criadoPor: true, fornecedor: true, imovel: true }
      }
    );
    return pedidos;
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao buscar Pedidos");
  }
}
