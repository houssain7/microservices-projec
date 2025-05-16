import { commandeController } from '../controllers/commandeController.js';

export const commandeRoutes = (app, commandeClient) => {
    const BASE_URL = '/api/commandes';

    /**
     * @route   GET /api/commandes
     * @desc    Get all commandes with pagination
     * @access  Public
     */
    app.get(BASE_URL, async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;

            const result = await commandeController.getCommandeList(commandeClient, page, limit);
            res.json(result);
        } catch (error) {
            console.error('Error fetching commandes:', error);
            res.status(500).json({
                error: 'Failed to fetch commandes',
                details: error.message
            });
        }
    });

    /**
     * @route   GET /api/commandes/:id
     * @desc    Get a commande by ID
     * @access  Public
     */
    app.get(`${BASE_URL}/:id`, async (req, res) => {
        try {
            const { id } = req.params;
            const commande = await commandeController.getCommande(commandeClient, id);

            if (!commande) {
                return res.status(404).json({ error: 'Commande not found' });
            }

            res.json(commande);
        } catch (error) {
            console.error('Error fetching commande:', error);

            if (error.message === 'Commande not found') {
                res.status(404).json({ error: 'Commande not found' });
            } else {
                res.status(500).json({
                    error: 'Failed to fetch commande',
                    details: error.message
                });
            }
        }
    });

    /**
     * @route   POST /api/commandes
     * @desc    Create a new commande
     * @access  Public
     */
    app.post(BASE_URL, async (req, res) => {
        try {
            const commandeData = req.body;

            if (!commandeData.products || !Array.isArray(commandeData.products) || commandeData.products.length === 0) {
                return res.status(400).json({
                    error: 'Missing or invalid products array',
                    required: 'An array of product objects with productId and quantity'
                });
            }

            // Validate products format
            for (const product of commandeData.products) {
                if (!product.productId || !product.quantity) {
                    return res.status(400).json({
                        error: 'Invalid product format',
                        required: 'Each product must have productId and quantity'
                    });
                }
            }

            const newCommande = await commandeController.createCommande(commandeClient, commandeData);
            res.status(201).json(newCommande);
        } catch (error) {
            console.error('Error creating commande:', error);
            res.status(500).json({
                error: 'Failed to create commande',
                details: error.message
            });
        }
    });

    /**
     * @route   PUT /api/commandes/:id
     * @desc    Update a commande
     * @access  Private
     */
    app.put(`${BASE_URL}/:id`, async (req, res) => {
        try {
            const { id } = req.params;
            const commandeData = req.body;

            const updatedCommande = await commandeController.updateCommande(commandeClient, id, commandeData);
            res.json(updatedCommande);
        } catch (error) {
            console.error('Error updating commande:', error);

            if (error.message === 'Commande not found') {
                res.status(404).json({ error: 'Commande not found' });
            } else {
                res.status(500).json({
                    error: 'Failed to update commande',
                    details: error.message
                });
            }
        }
    });

    /**
     * @route   DELETE /api/commandes/:id
     * @desc    Delete a commande
     * @access  Private
     */
    app.delete(`${BASE_URL}/:id`, async (req, res) => {
        try {
            const { id } = req.params;
            const success = await commandeController.deleteCommande(commandeClient, id);

            if (success) {
                res.json({ success: true, message: 'Commande deleted successfully' });
            } else {
                res.status(404).json({ error: 'Commande not found' });
            }
        } catch (error) {
            console.error('Error deleting commande:', error);

            if (error.message === 'Commande not found') {
                res.status(404).json({ error: 'Commande not found' });
            } else {
                res.status(500).json({
                    error: 'Failed to delete commande',
                    details: error.message
                });
            }
        }
    });
};
