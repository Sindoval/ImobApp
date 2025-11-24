"use server"

import { db } from "../_lib/prisma"

export async function getImoveis() {
  try {
    const imoveis = await db.imovel.findMany(
      {
        include: { imagens: true, documentos: true, engenheiro: true }
      }
    );
    return imoveis;
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao buscar imóveis");
  }
}

export async function getImovelById(id: string) {
  try {
    return await db.imovel.findUnique({
      where: { id },
      include: { imagens: true, documentos: true, engenheiro: true }
    });
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao buscar imóvel");
  }
}