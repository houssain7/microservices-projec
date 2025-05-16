import { productController } from '../controllers/productController.js';
import { commandeController } from '../controllers/commandeController.js';

export const createResolvers = (productClient, commandeClient) => {
  return {
    Query: {
      getProduct: (_, { id }) => productController.getProduct(productClient, id),
      getProductList: (_, { page, limit, search }) => productController.getProductList(productClient, page, limit, search),
      getCommande: (_, { id }) => commandeController.getCommande(commandeClient, id),
      getCommandeList: (_, { page, limit }) => commandeController.getCommandeList(commandeClient, page, limit),
    },

    Mutation: {
      createProduct: (_, { input }) => productController.createProduct(productClient, input),
      updateProduct: (_, { id, input }) => productController.updateProduct(productClient, id, input),
      deleteProduct: (_, { id }) => productController.deleteProduct(productClient, id),
      createCommande: (_, { input }) => commandeController.createCommande(commandeClient, input),
      updateCommande: (_, { id, input }) => commandeController.updateCommande(commandeClient, id, input),
      deleteCommande: (_, { id }) => commandeController.deleteCommande(commandeClient, id),
    },
  };
};
