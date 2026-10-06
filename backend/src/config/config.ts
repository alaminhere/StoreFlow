import dotenv from 'dotenv';

dotenv.config();

const config = {
  env: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 8000,
  clientUrl: process.env.CLIENT_URL ?? 'http://localhost:3000',
  database: {
    user: process.env.DATABASE_USER ?? '',
    password: process.env.DATABASE_PASSWORD ?? '',
    database: process.env.DATABASE_NAME ?? '',
    host: process.env.DATABASE_HOST ?? 'localhost',
    port: Number(process.env.DATABASE_PORT ?? 3306),
  },

  jwt: {
    secret: process.env.JWT_SECRET ?? '',
    accessExpirationSeconds:
      Number(process.env.JWT_ACCESS_EXPIRATION_SECONDS) || 30 * 24 * 60 * 60,
  },

  cookie: {
    isProd: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as 'lax' | 'strict',
    domain: process.env.COOKIE_DOMAIN || '',
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME ?? '',
    apiKey: process.env.CLOUDINARY_API_KEY ?? '',
    apiSecret: process.env.CLOUDINARY_API_SECRET ?? '',
  },

  email: {
    apiKey: process.env.RESEND_API_KEY ?? '',
    from: process.env.EMAIL_FROM ?? '',
  },
};

export default config;
