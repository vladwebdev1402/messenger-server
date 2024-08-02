const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const deleteConnections = async () => {
  await prisma.$connect();
  await prisma.connection.deleteMany();
  await prisma.$disconnect();
};

deleteConnections();
