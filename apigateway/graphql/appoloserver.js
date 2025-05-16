import { ApolloServer } from 'apollo-server-express';
import { addResolversToSchema } from '@graphql-tools/schema';
import { getSchema } from './schemaBuilder.js';
import { createResolvers } from './gplResolvers.js';

const setupApolloServer = async (productClient, commandeClient) => {
    const schema = await getSchema();
    const resolvers = createResolvers(productClient, commandeClient);

    return new ApolloServer({
        schema: addResolversToSchema({
            schema,
            resolvers,
        }),
        context: ({ req }) => {
            return {
                productClient,
                commandeClient,
            };
        }
    });
};

export default setupApolloServer;
