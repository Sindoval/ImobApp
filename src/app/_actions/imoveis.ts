"use server"

import { db } from "../_lib/prisma"

export async function getImoveis() {
  try {
    const imoveis = await db.imovel.findMany();
    return imoveis;
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao buscar imóveis");
  }
}