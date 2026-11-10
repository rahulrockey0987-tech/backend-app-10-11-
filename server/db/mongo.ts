
import 'dotenv/config';
import dns from 'node:dns';
import mongoose from 'mongoose';

dns.setServers(['8.8.8.8', '8.8.4.4']);

export async function connectMongoDB(): Promise<void> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MONGODB_URI is missing from .env');
  }

  const configuredDatabase =
    new URL(uri).pathname.slice(1).split('/')[0] || 'test';

  console.log('Configured MongoDB database:', configuredDatabase);

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
  });

  console.log(
    `MongoDB connected to database: ${mongoose.connection.name}`
  );
}
