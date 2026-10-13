/*
On définit les hooks Mocha globaux (before, beforeEach, after)
ils seront exécutés automatiquement 
l'interêt est d utiliser mongoDB Memory Server --> Créer une BD en mémoire (isolée et jetable)
*/


import { before, beforeEach, after } from 'mocha';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer;

before(async function () => { 
  this.timeout(60000) ;
  mongoServer = await MongoMemoryServer.create();  
  const uri = mongoServer.getUri();  
  await mongoose.connect(uri);
  console.log('MongoDB connection established.');
});

beforeEach(async () => {  
  const collections = mongoose.connection.collections;  
  for (const key in collections) {    
    await collections[key].deleteMany({});
  }
});

after(async () => { 
  await mongoose.disconnect();  
  await mongoServer.stop();
  console.log('MongoDB instance released.');
});
