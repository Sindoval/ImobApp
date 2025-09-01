import { PrismaClient } from "@/generated/prisma";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed...");

  // Limpar dados existentes (opcional - cuidado em produção)
  await prisma.orcamento.deleteMany();
  await prisma.fornecedorProduto.deleteMany();
  await prisma.estoque.deleteMany();
  await prisma.pedidoItem.deleteMany();
  await prisma.pedido.deleteMany();
  await prisma.imovelImagem.deleteMany();
  await prisma.imovel.deleteMany();
  await prisma.produto.deleteMany();
  await prisma.fornecedor.deleteMany();
  await prisma.usuario.deleteMany();
  await prisma.role.deleteMany();

  // Roles
  const admRole = await prisma.role.create({ data: { nome: "adm" } });
  const investidorRole = await prisma.role.create({ data: { nome: "investidor" } });
  const engenheiroRole = await prisma.role.create({ data: { nome: "engenheiro" } });
  const financeiroRole = await prisma.role.create({ data: { nome: "financeiro" } });

  // Hash para senhas (use bcrypt em produção)
  const senhaHash = "12345678"; // Em produção: await hash("12345678", 12)

  // Usuários
  const adm = await prisma.usuario.create({
    data: {
      nome: "Administrador Silva",
      email: "adm@imob.com",
      senhaHash: senhaHash,
      roleId: admRole.id,
    },
  });

  const investidor1 = await prisma.usuario.create({
    data: {
      nome: "Carlos Investidor",
      email: "carlos@invest.com",
      senhaHash: senhaHash,
      roleId: investidorRole.id,
    },
  });

  const investidor2 = await prisma.usuario.create({
    data: {
      nome: "Ana Capital",
      email: "ana@capital.com",
      senhaHash: senhaHash,
      roleId: investidorRole.id,
    },
  });

  const engenheiro1 = await prisma.usuario.create({
    data: {
      nome: "Maria Engenheira",
      email: "maria@engenharia.com",
      senhaHash: senhaHash,
      roleId: engenheiroRole.id,
    },
  });

  const engenheiro2 = await prisma.usuario.create({
    data: {
      nome: "João Construtor",
      email: "joao@construcao.com",
      senhaHash: senhaHash,
      roleId: engenheiroRole.id,
    },
  });

  const financeiro1 = await prisma.usuario.create({
    data: {
      nome: "Fernanda Financeiro",
      email: "fernanda@financeiro.com",
      senhaHash: senhaHash,
      roleId: financeiroRole.id,
    },
  });

  // Imóveis
  const imovel1 = await prisma.imovel.create({
    data: {
      endereco: "Rua das Flores, 123 - Jardim Paulista, São Paulo/SP",
      valorCompra: 450000,
      valorVenda: 620000,
      status: "em_reforma",
      engenheiroId: engenheiro1.id,
    },
  });

  const imovel2 = await prisma.imovel.create({
    data: {
      endereco: "Av. Brasil, 1500 - Moema, São Paulo/SP",
      valorCompra: 780000,
      valorVenda: 950000,
      status: "planejamento",
      engenheiroId: engenheiro2.id,
    },
  });

  const imovel3 = await prisma.imovel.create({
    data: {
      endereco: "Rua Augusta, 789 - Consolação, São Paulo/SP",
      valorCompra: 320000,
      valorVenda: 420000,
      status: "reforma_concluida",
      engenheiroId: engenheiro1.id,
    },
  });

  // Imagens dos imóveis
  await prisma.imovelImagem.createMany({
    data: [
      {
        imovelId: imovel1.id,
        url: "/uploads/imoveis/1/fachada.jpg",
        descricao: "Fachada principal"
      },
      {
        imovelId: imovel1.id,
        url: "/uploads/imoveis/1/sala.jpg",
        descricao: "Sala de estar"
      },
      {
        imovelId: imovel2.id,
        url: "/uploads/imoveis/2/externa.jpg",
        descricao: "Vista externa"
      },
      {
        imovelId: imovel3.id,
        url: "/uploads/imoveis/3/cozinha.jpg",
        descricao: "Cozinha reformada"
      }
    ],
  });

  // Produtos de construção
  const produtos = await prisma.produto.createMany({
    data: [
      {
        nome: "Cimento CP II",
        descricao: "Saco de cimento 50kg",
        unidade: "saco"
      },
      {
        nome: "Tijolo Cerâmico",
        descricao: "Tijolo 9x19x19cm",
        unidade: "unidade"
      },
      {
        nome: "Tinta Acrílica",
        descricao: "Lata 18L branco",
        unidade: "lata"
      },
      {
        nome: "Argamassa",
        descricao: "Saco 20kg",
        unidade: "saco"
      },
      {
        nome: "Piso Cerâmico",
        descricao: "Caixa 1.44m²",
        unidade: "caixa"
      },
      {
        nome: "Tubo PVC",
        descricao: "Tubo 100mm 3m",
        unidade: "unidade"
      },
      {
        nome: "Telha Cerâmica",
        descricao: "Telha colonial",
        unidade: "unidade"
      },
      {
        nome: "Porta de Madeira",
        descricao: "Porta 0.80x2.10m",
        unidade: "unidade"
      }
    ],
  });

  const produtosCriados = await prisma.produto.findMany();

  // Estoque
  await prisma.estoque.createMany({
    data: [
      { produtoId: produtosCriados[0].id, quantidade: 150 },
      { produtoId: produtosCriados[1].id, quantidade: 8000 },
      { produtoId: produtosCriados[2].id, quantidade: 45 },
      { produtoId: produtosCriados[3].id, quantidade: 200 },
      { produtoId: produtosCriados[4].id, quantidade: 60 },
      { produtoId: produtosCriados[5].id, quantidade: 120 },
      { produtoId: produtosCriados[6].id, quantidade: 500 },
      { produtoId: produtosCriados[7].id, quantidade: 25 }
    ],
  });

  // Fornecedores
  const fornecedores = await prisma.fornecedor.createMany({
    data: [
      {
        nome: "Construmax Materiais",
        contato: "(11) 99999-0000 | construmax@email.com"
      },
      {
        nome: "Leroy Merlin",
        contato: "(11) 4004-1234 | leroy@merlin.com"
      },
      {
        nome: "Telhanorte",
        contato: "(11) 3003-4040 | telhanorte@email.com"
      },
      {
        nome: "Cimento Nacional",
        contato: "(11) 3333-5555 | vendas@cimentonacional.com"
      }
    ],
  });

  const fornecedoresCriados = await prisma.fornecedor.findMany();

  // Relaciona produtos aos fornecedores
  await prisma.fornecedorProduto.createMany({
    data: [
      // Construmax
      { fornecedorId: fornecedoresCriados[0].id, produtoId: produtosCriados[0].id, preco: 32.90 },
      { fornecedorId: fornecedoresCriados[0].id, produtoId: produtosCriados[1].id, preco: 1.15 },
      { fornecedorId: fornecedoresCriados[0].id, produtoId: produtosCriados[2].id, preco: 189.90 },

      // Leroy Merlin
      { fornecedorId: fornecedoresCriados[1].id, produtoId: produtosCriados[3].id, preco: 28.50 },
      { fornecedorId: fornecedoresCriados[1].id, produtoId: produtosCriados[4].id, preco: 45.90 },
      { fornecedorId: fornecedoresCriados[1].id, produtoId: produtosCriados[5].id, preco: 22.75 },

      // Telhanorte
      { fornecedorId: fornecedoresCriados[2].id, produtoId: produtosCriados[6].id, preco: 3.80 },
      { fornecedorId: fornecedoresCriados[2].id, produtoId: produtosCriados[7].id, preco: 320.00 },

      // Cimento Nacional
      { fornecedorId: fornecedoresCriados[3].id, produtoId: produtosCriados[0].id, preco: 30.50 },
      { fornecedorId: fornecedoresCriados[3].id, produtoId: produtosCriados[3].id, preco: 26.90 }
    ],
  });

  // Pedidos
  const pedido1 = await prisma.pedido.create({
    data: {
      descricao: "Material para reforma da cozinha",
      status: "aprovado",
      imovelId: imovel1.id,
      criadoPorId: engenheiro1.id,
      aprovadoPorId: financeiro1.id,
    },
  });

  const pedido2 = await prisma.pedido.create({
    data: {
      descricao: "Material para fundação",
      status: "pendente",
      imovelId: imovel2.id,
      criadoPorId: engenheiro2.id,
    },
  });

  // Itens dos pedidos
  await prisma.pedidoItem.createMany({
    data: [
      // Pedido 1
      { pedidoId: pedido1.id, produtoId: produtosCriados[0].id, quantidade: 20, precoUnit: 32.90 },
      { pedidoId: pedido1.id, produtoId: produtosCriados[2].id, quantidade: 3, precoUnit: 189.90 },
      { pedidoId: pedido1.id, produtoId: produtosCriados[4].id, quantidade: 15, precoUnit: 45.90 },

      // Pedido 2
      { pedidoId: pedido2.id, produtoId: produtosCriados[1].id, quantidade: 1000, precoUnit: 1.15 },
      { pedidoId: pedido2.id, produtoId: produtosCriados[3].id, quantidade: 40, precoUnit: 28.50 },
      { pedidoId: pedido2.id, produtoId: produtosCriados[5].id, quantidade: 25, precoUnit: 22.75 }
    ],
  });

  // Orçamentos
  await prisma.orcamento.createMany({
    data: [
      {
        descricao: "Orçamento para reforma completa",
        valor: 28500,
        fornecedorId: fornecedoresCriados[0].id
      },
      {
        descricao: "Orçamento para instalação hidráulica",
        valor: 8900,
        fornecedorId: fornecedoresCriados[1].id
      },
      {
        descricao: "Orçamento para telhado",
        valor: 12700,
        fornecedorId: fornecedoresCriados[2].id
      }
    ],
  });

  console.log("✅ Seed concluída com sucesso!");
  console.log("📊 Dados criados:");
  console.log(`   👥 ${await prisma.usuario.count()} usuários`);
  console.log(`   🏢 ${await prisma.imovel.count()} imóveis`);
  console.log(`   📦 ${await prisma.produto.count()} produtos`);
  console.log(`   🏪 ${await prisma.fornecedor.count()} fornecedores`);
  console.log(`   📋 ${await prisma.pedido.count()} pedidos`);
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