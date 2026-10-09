import fs from 'node:fs';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import config from '../config/config.js';
import { PrismaClient } from '../generated/prisma/client.js';

const adapter = new PrismaMariaDb({
  user: config.database.user,
  host: config.database.host,
  password: config.database.password,
  database: config.database.database,
  port: config.database.port,
  ssl: { ca: fs.readFileSync('certs/ca.pem', 'utf8') },
});

export const prisma = new PrismaClient({ adapter });

export const connectDB = async () => {
  await prisma.$connect();
  console.log('Database connected successfully :: ', config.database.database);
};
