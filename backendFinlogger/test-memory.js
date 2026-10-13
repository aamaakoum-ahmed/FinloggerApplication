import { MongoMemoryServer } from 'mongodb-memory-server';

console.log('Creation du serveur...');
const server = await MongoMemoryServer.create();
console.log('URI :', server.getUri());
await server.stop();
console.log('Serveur arrete avec succes.');