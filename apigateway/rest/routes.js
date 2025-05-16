import { productRoutes } from './productRoutes.js';
import { commandeRoutes } from './commandeRoutes.js';

export const setupRoutes = (app, productClient, commandeClient) => {
    // Root route for API health check
    app.get('/api', (req, res) => {
        res.json({
            status: 'success',
            message: 'API Gateway is running',
            version: '1.0.0',
            endpoints: {
                products: '/api/products',
                commandes: '/api/commandes'
            }
        });
    });

    // Setup product routes
    productRoutes(app, productClient);

    // Setup commande routes
    commandeRoutes(app, commandeClient);
};
