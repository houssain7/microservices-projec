import { loadPackageDefinition, Server, ServerCredentials } from '@grpc/grpc-js';
import { loadSync } from '@grpc/proto-loader';
import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from 'dotenv';
import { connectToDatabase } from './db/connection.js';
import * as commandeHandlers from './handlers/commandeHandlers.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROTO_PATH = path.join(__dirname, '../protos/commande.proto');

const packageDefinition = loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const protoDescriptor = loadPackageDefinition(packageDefinition);
const commandeService = protoDescriptor.CommandeService;

const server = new Server();

server.addService(commandeService.service, {
    getCommande: commandeHandlers.getCommande,
    getCommandes: commandeHandlers.getCommandes,
    createCommande: commandeHandlers.createCommande,
    updateCommande: commandeHandlers.updateCommande,
    deleteCommande: commandeHandlers.deleteCommande,
});

const PORT = process.env.PORT || 5002;
const HOST = process.env.HOST || '0.0.0.0';

async function startServer() {
    try {
        await connectToDatabase();

        server.bindAsync(`${HOST}:${PORT}`, ServerCredentials.createInsecure(), (err, port) => {
            if (err) {
                console.error('Failed to start gRPC server:', err);
                process.exit(1);
            }

            console.log(`gRPC Commande service running on ${HOST}:${port}`);
            server.start();
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();
