"use server"

import { db } from "../_lib/prisma"

export async function getFornecedores() {
  try {
    const fornecedores = await db.fornecedor.findMany();
    return fornecedores;
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao buscar fornecedores");
  }
}