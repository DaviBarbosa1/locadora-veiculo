import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const veiculos = [
  { marca: 'Fiat', modelo: 'Argo', placa: 'ABC1D23', ano: 2023, valorDiaria: 120 },
  { marca: 'Volkswagen', modelo: 'Polo', placa: 'BRA2E19', ano: 2024, valorDiaria: 150 },
  { marca: 'Chevrolet', modelo: 'Onix', placa: 'QWE3F45', ano: 2022, valorDiaria: 110 },
  { marca: 'Toyota', modelo: 'Corolla', placa: 'RTY4G67', ano: 2024, valorDiaria: 240 },
  { marca: 'Jeep', modelo: 'Renegade', placa: 'UIO5H89', ano: 2023, valorDiaria: 210 }
];

async function main() {
  const senha = await bcrypt.hash('123456', 10);

  await prisma.usuario.upsert({
    where: { email: 'demo@locadora.com' },
    update: {},
    create: { nome: 'Usuário Demonstração', email: 'demo@locadora.com', senha }
  });

  for (const veiculo of veiculos) {
    await prisma.veiculo.upsert({
      where: { placa: veiculo.placa },
      update: {},
      create: veiculo
    });
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (erro) => {
    console.error(erro);
    await prisma.$disconnect();
    process.exit(1);
  });
