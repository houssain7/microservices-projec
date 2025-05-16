import express from "express";
import dotenv from "dotenv";
import setupApolloServer from "./graphql/appoloserver.js";
import { productClient, commandeClient } from "./grpc/clients.js";
import { setupRoutes } from "./rest/routes.js";
import cors from "cors";

dotenv.config({
  path: "../.env",
});
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

setupRoutes(app, productClient, commandeClient);

async function startServer() {
  const server = await setupApolloServer(productClient, commandeClient);
  await server.start();
  server.applyMiddleware({ app });
  app.listen(5000, () => {
    console.log(`API Gateway running on port 5000`);
    console.log(`GraphQL endpoint available at http://localhost:5000${server.graphqlPath}`);
    console.log(`REST API endpoints available at http://localhost:5000/api`);
  });
}

startServer();
