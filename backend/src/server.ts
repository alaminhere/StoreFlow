import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import config from './config/config.js';
import rootRoutes from './routes/root.routes.js';
import notFound from './middlewares/notFound.js';
import { errorConverter, errorHandler } from './middlewares/errorHandler.js';
import { connectDB, prisma } from './db/db.js';
import type { Server } from 'node:http';
import http from 'node:http';
import { initSocket } from './helpers/socket/socket.js';

const app = express();

app.use(
  cors({
    origin: config.clientUrl,
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1', rootRoutes);

// notFound and Error handlers
app.use(notFound);
app.use(errorConverter);
app.use(errorHandler);

let server: Server | undefined;

// connect db
connectDB()
  .then(() => {
    server = http.createServer(app);
    initSocket(server);

    server.listen(config.port, () => {
      console.log(`Server is  running  :: http://localhost:${config.port}`);
      console.log(`Environment :: ${config.env}`);
    });
  })
  .catch(error => {
    console.log(`Failed to connect  to Database : ${error}`);
    process.exit(1);
  });

// exit Handler
const exitHandle = () => {
  if (server) {
    server.close(() => {
      console.log('Server Close ');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedError = (error: unknown) => {
  console.log(error);
  exitHandle();
};

process.on('uncaughtException', unexpectedError);
process.on('unhandledRejection', unexpectedError);

process.on('SIGTERM', () => {
  console.log('SIGTERM Receive');
  if (server) {
    server.close(async () => {
      await prisma.$disconnect();
      process.exit(0);
    });
  }
});
