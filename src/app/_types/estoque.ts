import { Prisma } from "@/generated/prisma";

export type EstoqueComProduto = Prisma.EstoqueGetPayload<{
  include: { produto: true };
}>;

export type ImovelComImagens = Prisma.ImovelGetPayload<{
  include: { imagens: true, documentos: true, engenheiro: true }
}>;

export type PedidoInfo = Prisma.PedidoGetPayload<{
  include: { criadoPor: true, fornecedor: true, imovel: true, itens: true }
}>

export type UserComRole = Prisma.UsuarioGetPayload<{
  include: { role: true }
}>