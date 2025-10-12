"use server";

import { db } from "@/app/_lib/prisma";

export async function getEstoque() {
  return await db.estoque.findMany({
    include: { produto: true },
  });
}