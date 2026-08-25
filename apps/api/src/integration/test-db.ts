import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let memoryServer: MongoMemoryServer | undefined;

/** Demarre un MongoDB en memoire et y connecte mongoose - aucune ecriture ne touche jamais Atlas. */
export async function startTestDb(): Promise<void> {
  memoryServer = await MongoMemoryServer.create();
  await mongoose.connect(memoryServer.getUri());
}

export async function stopTestDb(): Promise<void> {
  await mongoose.disconnect();
  await memoryServer?.stop();
}

export async function clearTestDb(): Promise<void> {
  const collections = mongoose.connection.collections;
  await Promise.all(Object.values(collections).map((collection) => collection.deleteMany({})));
}
