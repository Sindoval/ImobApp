import { PrismaClient } from "@/generated/prisma";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed completo...");

  // 🧹 Limpa os dados anteriores
  await prisma.pedidoItem.deleteMany();
  await prisma.pedido.deleteMany();
  await prisma.estoque.deleteMany();
  await prisma.produto.deleteMany();
  await prisma.fornecedor.deleteMany();
  await prisma.documento.deleteMany();
  await prisma.imovelImagem.deleteMany();
  await prisma.imovel.deleteMany();
  await prisma.usuario.deleteMany();
  await prisma.role.deleteMany();

  // === ROLES ===
  await prisma.role.createMany({
    data: [
      { nome: "adm" },
      { nome: "engenheiro" },
      { nome: "financeiro" },
      { nome: "investidor" },
    ],
  });

  const [admRole, engenheiroRole, financeiroRole, investidorRole] =
    await prisma.role.findMany();

  const senhaHash = "12345678";

  // === USUÁRIOS ===
  await prisma.usuario.createMany({
    data: [
      { nome: "Administrador Geral", email: "adm@imob.com", senhaHash, roleId: admRole.id },
      { nome: "Maria Engenheira", email: "maria@engenharia.com", senhaHash, roleId: engenheiroRole.id },
      { nome: "João Construtor", email: "joao@construtor.com", senhaHash, roleId: engenheiroRole.id },
      { nome: "Fernanda Financeiro", email: "fernanda@financeiro.com", senhaHash, roleId: financeiroRole.id },
      { nome: "Carlos Investidor", email: "carlos@investidor.com", senhaHash, roleId: investidorRole.id },
      { nome: "Ana Capital", email: "ana@capital.com", senhaHash, roleId: investidorRole.id },
    ],
  });

  const [adm, maria, joao, fernanda, carlos, ana] = await prisma.usuario.findMany();

  // === FORNECEDORES ===
  await prisma.fornecedor.createMany({
    data: [
      { nome: "Construmax Materiais", contato: "(11) 99999-0000" },
      { nome: "Leroy Merlin", contato: "(11) 4004-1234" },
      { nome: "Telhanorte", contato: "(11) 3003-4040" },
      { nome: "Cimento Nacional", contato: "(11) 3333-5555" },
    ],
  });

  const fornecedoresCriados = await prisma.fornecedor.findMany();

  // === IMÓVEIS ===
  await prisma.imovel.createMany({
    data: [
      {
        endereco: "Rua das Flores, 123 - Jardim Paulista, São Paulo/SP",
        valorCompra: 450000,
        valorVenda: 620000,
        status: "em_reforma",
        engenheiroId: maria.id,
      },
      {
        endereco: "Av. Brasil, 1500 - Moema, São Paulo/SP",
        valorCompra: 780000,
        valorVenda: 950000,
        status: "planejamento",
        engenheiroId: joao.id,
      },
      {
        endereco: "Rua Augusta, 789 - Consolação, São Paulo/SP",
        valorCompra: 320000,
        valorVenda: 420000,
        status: "reforma_concluida",
        engenheiroId: maria.id,
      },
      {
        endereco: "Rua Bela Vista, 45 - Santo André/SP",
        valorCompra: 500000,
        valorVenda: 710000,
        status: "em_reforma",
        engenheiroId: joao.id,
      },
    ],
  });

  const imoveisCriados = await prisma.imovel.findMany();

  // === IMAGENS DO IMÓVEL (VAZIO) ===
  // nenhum createMany aqui

  // === DOCUMENTOS (VAZIO) ===
  // nenhum createMany aqui

  // === PRODUTOS ===
  await prisma.produto.createMany({
    data: [
      { nome: "Cimento CP II", descricao: "Saco 50kg", unidade: "saco" },
      { nome: "Tinta Acrílica", descricao: "Lata 18L branco", unidade: "lata" },
      { nome: "Piso Cerâmico", descricao: "Caixa 1.44m²", unidade: "caixa" },
      { nome: "Argamassa AC-II", descricao: "Saco 20kg", unidade: "saco" },
    ],
  });

  const produtosCriados = await prisma.produto.findMany();

  await prisma.estoque.createMany({
    data: [
      { produtoId: produtosCriados[0].id, quantidade: 250 },
      { produtoId: produtosCriados[1].id, quantidade: 90 },
      { produtoId: produtosCriados[2].id, quantidade: 60 },
      { produtoId: produtosCriados[3].id, quantidade: 300 },
    ],
  });

  // === PEDIDOS ===
  const pedido1 = await prisma.pedido.create({
    data: {
      descricao: "Materiais para cozinha",
      status: "aprovado",
      imovelId: imoveisCriados[0].id,
      criadoPorId: maria.id,
      aprovadoPorId: fernanda.id,
      fornecedorId: fornecedoresCriados[0].id,
      notaFiscalUrl: "/uploads/notas/nota1.pdf",
      diretoParaImovel: true,
    },
  });

  await prisma.pedidoItem.createMany({
    data: [
      { pedidoId: pedido1.id, nome: "Piso Cerâmico", quantidade: 20, precoUnit: 46.9 },
    ],
  });

  console.log("✅ Seed completo criado com sucesso!");
}

main()
  .catch(async (e) => {
    console.error("❌ Erro no seed:", e);
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
