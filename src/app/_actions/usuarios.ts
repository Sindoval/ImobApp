"use server"

import { db } from "../_lib/prisma"

export async function getUsers() {
  try {
    const users = await db.usuario.findMany();
    return users;
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao buscar usuários");
  }
}