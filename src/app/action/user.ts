"use server"

import { db } from "../_lib/prisma";

export const userVerify = async (email: string, senha: string) => {
  const users = await db.usuario.findMany({});
  console.log(users);
  return users.some((user) => (user.email === email && user.senhaHash === senha));
}

export const userRegister = async (nome: string, email: string, senha: string, rolename: string) => {
  const role = await db.role.findFirst({
    where: { nome: rolename }
  })

  if (!role) {
    throw new Error("Role não encontrada");
  }

  const usuario = await db.usuario.create({
    data: {
      nome,
      email,
      senhaHash: senha,
      roleId: role.id
    }
  });

  return usuario;
}