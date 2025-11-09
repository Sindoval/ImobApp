/*
  Warnings:

  - You are about to drop the `FornecedorProduto` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Orcamento` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."FornecedorProduto" DROP CONSTRAINT "FornecedorProduto_fornecedorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."FornecedorProduto" DROP CONSTRAINT "FornecedorProduto_produtoId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Orcamento" DROP CONSTRAINT "Orcamento_fornecedorId_fkey";

-- AlterTable
ALTER TABLE "public"."Imovel" ADD COLUMN     "descricao" TEXT,
ADD COLUMN     "prazoFinal" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "public"."Pedido" ADD COLUMN     "notaFiscalUrl" TEXT;

-- AlterTable
ALTER TABLE "public"."PedidoItem" ADD COLUMN     "criadoDoEstoque" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "fornecedorId" TEXT;

-- DropTable
DROP TABLE "public"."FornecedorProduto";

-- DropTable
DROP TABLE "public"."Orcamento";

-- AddForeignKey
ALTER TABLE "public"."PedidoItem" ADD CONSTRAINT "PedidoItem_fornecedorId_fkey" FOREIGN KEY ("fornecedorId") REFERENCES "public"."Fornecedor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
