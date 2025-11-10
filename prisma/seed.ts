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
  await prisma.imovelImagem.deleteMany();
  await prisma.imovel.deleteMany();
  await prisma.usuario.deleteMany();
  await prisma.role.deleteMany();

  // === ROLES ===
  const roles = await prisma.role.createMany({
    data: [
      { nome: "adm" },
      { nome: "engenheiro" },
      { nome: "financeiro" },
      { nome: "investidor" },
    ],
  });

  const [admRole, engenheiroRole, financeiroRole, investidorRole] =
    await prisma.role.findMany();

  const senhaHash = "12345678"; // lembre-se: usar bcrypt em produção

  // === USUÁRIOS ===
  const usuarios = await prisma.usuario.createMany({
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
  const fornecedores = await prisma.fornecedor.createMany({
    data: [
      { nome: "Construmax Materiais", contato: "(11) 99999-0000 | construmax@email.com" },
      { nome: "Leroy Merlin", contato: "(11) 4004-1234 | leroy@merlin.com" },
      { nome: "Telhanorte", contato: "(11) 3003-4040 | telhanorte@email.com" },
      { nome: "Cimento Nacional", contato: "(11) 3333-5555 | vendas@cimentonacional.com" },
    ],
  });

  const fornecedoresCriados = await prisma.fornecedor.findMany();

  // === IMÓVEIS ===
  const imoveis = await prisma.imovel.createMany({
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

  await prisma.imovelImagem.createMany({
    data: [
      {
        imovelId: imoveisCriados[0].id,
        url: "https://res.cloudinary.com/demo/image/upload/v123456789/imoveis/1_capa.jpg",
        publicId: "imoveis/1_capa",
        descricao: "Fachada principal",
      },
      {
        imovelId: imoveisCriados[1].id,
        url: "https://res.cloudinary.com/demo/image/upload/v123456789/imoveis/2_capa.jpg",
        publicId: "imoveis/2_capa",
        descricao: "Vista frontal",
      },
      {
        imovelId: imoveisCriados[2].id,
        url: "https://res.cloudinary.com/demo/image/upload/v123456789/imoveis/3_capa.jpg",
        publicId: "imoveis/3_capa",
        descricao: "Sala reformada",
      },
    ],
  });

  // === PRODUTOS ===
  const produtos = await prisma.produto.createMany({
    data: [
      { nome: "Cimento CP II", descricao: "Saco 50kg", unidade: "saco" },
      { nome: "Tinta Acrílica", descricao: "Lata 18L branco", unidade: "lata" },
      { nome: "Piso Cerâmico", descricao: "Caixa 1.44m²", unidade: "caixa" },
      { nome: "Argamassa AC-II", descricao: "Saco 20kg", unidade: "saco" },
      { nome: "Tijolo Cerâmico", descricao: "9x19x19cm", unidade: "unidade" },
      { nome: "Tubo PVC 100mm", descricao: "Tubo 3m", unidade: "unidade" },
      { nome: "Porta de Madeira", descricao: "0.80x2.10m", unidade: "unidade" },
      { nome: "Telha Cerâmica", descricao: "Colonial", unidade: "unidade" },
    ],
  });

  const produtosCriados = await prisma.produto.findMany();

  // === ESTOQUE ===
  await prisma.estoque.createMany({
    data: [
      { produtoId: produtosCriados[0].id, quantidade: 250 },
      { produtoId: produtosCriados[1].id, quantidade: 90 },
      { produtoId: produtosCriados[2].id, quantidade: 60 },
      { produtoId: produtosCriados[3].id, quantidade: 300 },
      { produtoId: produtosCriados[4].id, quantidade: 15000 },
      { produtoId: produtosCriados[5].id, quantidade: 120 },
      { produtoId: produtosCriados[6].id, quantidade: 35 },
      { produtoId: produtosCriados[7].id, quantidade: 700 },
    ],
  });

  // === PEDIDOS ===
  const pedido1 = await prisma.pedido.create({
    data: {
      descricao: "Materiais para cozinha e piso do imóvel 1",
      status: "aprovado",
      imovelId: imoveisCriados[0].id,
      criadoPorId: maria.id,
      aprovadoPorId: fernanda.id,
      fornecedorId: fornecedoresCriados[0].id,
      notaFiscalUrl: "/uploads/notas/nota_cozinha.pdf",
      diretoParaImovel: true,
    },
  });

  const pedido2 = await prisma.pedido.create({
    data: {
      descricao: "Reposição de cimento e argamassa para estoque",
      status: "entregue",
      criadoPorId: fernanda.id,
      fornecedorId: fornecedoresCriados[1].id,
      notaFiscalUrl: "/uploads/notas/nota_estoque.pdf",
      diretoParaImovel: false,
    },
  });

  const pedido3 = await prisma.pedido.create({
    data: {
      descricao: "Telhas e madeira para cobertura do imóvel 4",
      status: "pendente",
      imovelId: imoveisCriados[3].id,
      criadoPorId: joao.id,
      fornecedorId: fornecedoresCriados[2].id,
      notaFiscalUrl: "/uploads/notas/nota_telhas.pdf",
      diretoParaImovel: true,
    },
  });

  // === ITENS DOS PEDIDOS ===
  await prisma.pedidoItem.createMany({
    data: [
      // Pedido 1
      { pedidoId: pedido1.id, produtoId: produtosCriados[2].id, quantidade: 20, precoUnit: 46.9 },
      { pedidoId: pedido1.id, produtoId: produtosCriados[1].id, quantidade: 4, precoUnit: 175.0 },

      // Pedido 2
      { pedidoId: pedido2.id, produtoId: produtosCriados[0].id, quantidade: 100, precoUnit: 31.9 },
      { pedidoId: pedido2.id, produtoId: produtosCriados[3].id, quantidade: 50, precoUnit: 25.5 },

      // Pedido 3
      { pedidoId: pedido3.id, produtoId: produtosCriados[6].id, quantidade: 5, precoUnit: 310.0 },
      { pedidoId: pedido3.id, produtoId: produtosCriados[7].id, quantidade: 200, precoUnit: 3.5 },
    ],
  });

  // === LOG FINAL ===
  console.log("✅ Seed completo criado com sucesso!");
  console.log(`👥 Usuários: ${await prisma.usuario.count()}`);
  console.log(`🏢 Imóveis: ${await prisma.imovel.count()}`);
  console.log(`📦 Produtos: ${await prisma.produto.count()}`);
  console.log(`🏪 Fornecedores: ${await prisma.fornecedor.count()}`);
  console.log(`🧾 Pedidos: ${await prisma.pedido.count()}`);
  console.log(`📊 Itens de Pedido: ${await prisma.pedidoItem.count()}`);
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
