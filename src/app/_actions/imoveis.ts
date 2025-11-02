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

export async function getImovelById(id: string) {
  try {
    const imovel = await db.imovel.findUnique({
      where: { id }
    });
    return imovel;
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao buscar imóvel");
  }
}