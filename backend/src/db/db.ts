import fs from 'node:fs';
import path from 'node:path';
import config from '../config/config.js';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../generated/prisma/client.js';

const caPath = path.resolve(process.cwd(), 'certs/ca.pem');

const adapter = new PrismaMariaDb({
  user: config.database.user,
  host: config.database.host,
  password: config.database.password,
  database: config.database.database,
  port: config.database.port,
  ssl: { ca: fs.readFileSync(caPath, 'utf8') },
});

export const prisma = new PrismaClient({ adapter });

export const connectDB = async () => {
  await prisma.$connect();
  console.log('Database connected successfully :: ', config.database.database);
};
