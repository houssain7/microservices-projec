import { produitController } from '../controllers/productController.js';

export const productRoutes = (app, productClient) => {
    const router = app._router;
    const BASE_URL = '/api/products';

    /**
     * @route   GET /api/products
     * @desc    Get all products with pagination and search
     * @access  Public
     */
    app.get(BASE_URL, async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const search = req.query.search || '';

            const result = await produitController.getProductList(productClient, page, limit, search);
            res.json(result);
        } catch (error) {
            console.error('Error fetching products:', error);
            res.status(500).json({
                error: 'Failed to fetch products',
                details: error.message
            });
        }
    });

    /**
     * @route   GET /api/products/:id
     * @desc    Get a product by ID
     * @access  Public
     */
    app.get(`${BASE_URL}/:id`, async (req, res) => {
        try {
            const { id } = req.params;
            const product = await produitController.getProduct(productClient, id);

            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }

            res.json(product);
        } catch (error) {
            console.error('Error fetching product:', error);

            if (error.message === 'Product not found') {
                res.status(404).json({ error: 'Product not found' });
            } else {
                res.status(500).json({
                    error: 'Failed to fetch product',
                    details: error.message
                });
            }
        }
    });

    /**
     * @route   POST /api/products
     * @desc    Create a new product
     * @access  Private
     */
    app.post(BASE_URL, async (req, res) => {
        try {
            const productData = req.body;

            if (!productData.name || !productData.description ||
                productData.stock === undefined || productData.price === undefined) {
                return res.status(400).json({
                    error: 'Missing required fields',
                    required: ['name', 'description', 'stock', 'price']
                });
            }

            const newProduct = await produitController.createProduct(productClient, productData);
            res.status(201).json(newProduct);
        } catch (error) {
            console.error('Error creating product:', error);
            res.status(500).json({
                error: 'Failed to create product',
                details: error.message
            });
        }
    });

    /**
     * @route   PUT /api/products/:id
     * @desc    Update a product
     * @access  Private
     */
    app.put(`${BASE_URL}/:id`, async (req, res) => {
        try {
            const { id } = req.params;
            const productData = req.body;

            const updatedProduct = await produitController.updateProduct(productClient, id, productData);
            res.json(updatedProduct);
        } catch (error) {
            console.error('Error updating product:', error);

            if (error.message === 'Product not found') {
                res.status(404).json({ error: 'Product not found' });
            } else {
                res.status(500).json({
                    error: 'Failed to update product',
                    details: error.message
                });
            }
        }
    });

    /**
     * @route   DELETE /api/products/:id
     * @desc    Delete a product
     * @access  Private
     */
    app.delete(`${BASE_URL}/:id`, async (req, res) => {
        try {
            const { id } = req.params;
            const success = await produitController.deleteProduct(productClient, id);

            if (success) {
                res.json({ success: true, message: 'Product deleted successfully' });
            } else {
                res.status(404).json({ error: 'Product not found' });
            }
        } catch (error) {
            console.error('Error deleting product:', error);

            if (error.message === 'Product not found') {
                res.status(404).json({ error: 'Product not found' });
            } else {
                res.status(500).json({
                    error: 'Failed to delete product',
                    details: error.message
                });
            }
        }
    });
};
