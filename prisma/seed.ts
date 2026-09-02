import { PrismaClient } from "../src/generated/prisma";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

const categories = [
  { slug: "veiculos", name: "Veículos", icon: "car" },
  { slug: "imoveis", name: "Imóveis", icon: "home" },
  { slug: "eletronicos", name: "Eletrônicos", icon: "smartphone" },
  { slug: "moveis", name: "Móveis e Casa", icon: "sofa" },
  { slug: "moda", name: "Moda e Beleza", icon: "shirt" },
  { slug: "esportes", name: "Esporte e Lazer", icon: "dumbbell" },
  { slug: "emprego", name: "Vagas de Emprego", icon: "briefcase" },
  { slug: "servicos", name: "Serviços", icon: "wrench" },
  { slug: "animais", name: "Animais de Estimação", icon: "paw-print" },
  { slug: "infantil", name: "Infantil", icon: "baby" },
  { slug: "musica", name: "Música e Hobbies", icon: "guitar" },
  { slug: "agro", name: "Agro e Indústria", icon: "tractor" },
];

function unsplash(id: string) {
  return `https://images.unsplash.com/photo-${id}?q=80&w=1200&auto=format&fit=crop`;
}

const listingsSeed = [
  { title: "Honda Civic EXL 2020 - Impecável, único dono", price: 118900, cat: "veiculos", city: "São Paulo", state: "SP", condition: "used", desc: "Civic EXL 2020, revisões em dia na concessionária, pneus novos, multimídia, teto solar. Aceito troca com volta.", img: "1552519507-da3b142c6e3d" },
  { title: "Apartamento 2 quartos com varanda gourmet", price: 320000, cat: "imoveis", city: "Curitiba", state: "PR", condition: "used", desc: "70m², 2 quartos, 1 suíte, varanda gourmet, vaga coberta, condomínio com lazer completo. Próximo ao metrô.", img: "1522708323590-d24dbb6b0267" },
  { title: "iPhone 14 Pro 256GB Roxo - Estado de novo", price: 4650, cat: "eletronicos", city: "Belo Horizonte", state: "MG", condition: "used", desc: "Bateria 96%, sem riscos, com caixa, carregador e nota fiscal. Aceito cartão.", img: "1511707171634-5f897ff02aa9" },
  { title: "Sofá retrátil e reclinável 3 lugares cinza", price: 1890, cat: "moveis", city: "Porto Alegre", state: "RS", condition: "new", desc: "Sofá novo, tecido suede, estrutura reforçada. Entrega inclusa na capital.", img: "1555041469-a586c61ea9bc" },
  { title: "Tênis Nike Air Max 90 - Número 42", price: 349, cat: "moda", city: "Rio de Janeiro", state: "RJ", condition: "new", desc: "Original, na caixa, nunca usado. Comprado e não serviu.", img: "1542291026-7eec264c27ff" },
  { title: "Bicicleta Speed Caloi 10 velocidades", price: 2200, cat: "esportes", city: "Florianópolis", state: "SC", condition: "used", desc: "Quadro em alumínio, câmbio Shimano, poucos km rodados, revisada recentemente.", img: "1485965120184-e220f721d03e" },
  { title: "Vaga: Desenvolvedor(a) Frontend React - Remoto", price: 0, cat: "emprego", city: "São Paulo", state: "SP", condition: "new", desc: "Empresa de tecnologia contrata dev frontend pleno, remoto, CLT, benefícios completos.", img: "1498050108023-c5249f4df085" },
  { title: "Serviço de pintura residencial e comercial", price: 0, cat: "servicos", city: "Campinas", state: "SP", condition: "new", desc: "Pintor com 15 anos de experiência, orçamento sem compromisso, materiais de qualidade.", img: "1562259949-e8e7689d7828" },
  { title: "Filhotes de Golden Retriever com pedigree", price: 3500, cat: "animais", city: "São José dos Campos", state: "SP", condition: "new", desc: "Filhotes vacinados e vermifugados, pais com pedigree CBKC. Entrego com carteirinha.", img: "1552053831-71594a27632d" },
  { title: "Carrinho de bebê Burigotto 3 em 1", price: 780, cat: "infantil", city: "Salvador", state: "BA", condition: "used", desc: "Usado poucas vezes, todos os acessórios inclusos, bebê conforto e moisés.", img: "1714392512700-4cab9e51710b" },
  { title: "Violão Fender clássico com case", price: 890, cat: "musica", city: "Recife", state: "PE", condition: "used", desc: "Cordas de nylon, ótimo para iniciantes, acompanha capa acolchoada e afinador.", img: "1525201548942-d8732f6617a0" },
  { title: "Trator agrícola New Holland TL75 - Revisado", price: 89000, cat: "agro", city: "Ribeirão Preto", state: "SP", condition: "refurbished", desc: "Motor e transmissão revisados, pneus 80%, documentação em dia.", img: "1571509107684-7e3034a90012" },
  { title: "Notebook Dell Inspiron 15 i7 16GB SSD 512GB", price: 3299, cat: "eletronicos", city: "Belo Horizonte", state: "MG", condition: "used", desc: "Ótimo para trabalho e estudos, bateria excelente, acompanha mochila.", img: "1496181133206-80ce9b88a853" },
  { title: "Terreno 500m² em condomínio fechado", price: 195000, cat: "imoveis", city: "Goiânia", state: "GO", condition: "new", desc: "Documentação regularizada, pronto para construir, área de lazer no condomínio.", img: "1500382017468-9049fed747ef" },
  { title: "Yamaha Fazer 250 2019 - Baixa quilometragem", price: 16500, cat: "veiculos", city: "Fortaleza", state: "CE", condition: "used", desc: "Único dono, revisões na concessionária, pneus novos, sem detalhes.", img: "1558981806-ec527fa84c39" },
  { title: "Mesa de jantar 6 lugares madeira maciça", price: 1350, cat: "moveis", city: "São Paulo", state: "SP", condition: "used", desc: "Madeira de demolição, cadeiras estofadas inclusas, ótimo estado.", img: "1617806118233-18e1de247200" },
];

async function main() {
  console.log("Seeding...");

  // Clear previously seeded/demo listings so this script can be re-run safely.
  await db.message.deleteMany({});
  await db.conversation.deleteMany({});
  await db.favorite.deleteMany({});
  await db.review.deleteMany({});
  await db.listing.deleteMany({});

  for (const c of categories) {
    await db.category.upsert({ where: { slug: c.slug }, update: {}, create: c });
  }

  const demoUsers = [
    { name: "Marina Alves", email: "marina@achou.dev", city: "São Paulo", state: "SP" },
    { name: "Rafael Torres", email: "rafael@achou.dev", city: "Curitiba", state: "PR" },
    { name: "Juliana Prado", email: "juliana@achou.dev", city: "Belo Horizonte", state: "MG" },
  ];

  const passwordHash = await bcrypt.hash("senha123", 10);
  const users = [];
  for (const u of demoUsers) {
    const user = await db.user.upsert({
      where: { email: u.email },
      update: {},
      create: { ...u, passwordHash, avatarSeed: u.name, bio: "Vendedor(a) na Achou desde 2023." },
    });
    users.push(user);
  }

  const allCategories = await db.category.findMany();

  for (let i = 0; i < listingsSeed.length; i++) {
    const item = listingsSeed[i];
    const category = allCategories.find((c) => c.slug === item.cat)!;
    const owner = users[i % users.length];
    const images = [unsplash(item.img)];
    await db.listing.create({
      data: {
        title: item.title,
        description: item.desc,
        price: item.price,
        condition: item.condition,
        city: item.city,
        state: item.state,
        categoryId: category.id,
        userId: owner.id,
        images: JSON.stringify(images),
        featured: i < 6,
        views: Math.floor(Math.random() * 400),
      },
    });
  }

  console.log("Seed concluído.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
