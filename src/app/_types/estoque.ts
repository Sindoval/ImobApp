import { Prisma } from "@/generated/prisma";

export type EstoqueComProduto = Prisma.EstoqueGetPayload<{
  include: { produto: true };
}>;

export type ImovelComImagens = Prisma.ImovelGetPayload<{
  include: { imagens: true }
}>;
