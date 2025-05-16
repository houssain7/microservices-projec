import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path from "path";
import { fileURLToPath } from "url";

// Fix file path resolution
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const produitProto = protoLoader.loadSync(path.join(__dirname, "../../protos/produit.proto"), {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
const commandeProto = protoLoader.loadSync(path.join(__dirname, "../../protos/commande.proto"), {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const ProduitService = grpc.loadPackageDefinition(produitProto).ProduitService;
const CommandeService = grpc.loadPackageDefinition(commandeProto).CommandeService;

const productClient = new ProduitService(
    "localhost:5001",
    grpc.credentials.createInsecure()
);

const commandeClient = new CommandeService(
    "localhost:5002",
    grpc.credentials.createInsecure()
);

export { productClient, commandeClient };
