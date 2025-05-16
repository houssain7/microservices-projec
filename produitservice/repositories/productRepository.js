import Product from '../models/Product.js';

export const productRepository = {
    async getProductById(id) {
        try {
            const product = await Product.findById(id);
            if (!product) {
                throw new Error('Product not found');
            }
            return product;
        } catch (error) {
            throw error;
        }
    },

    async getProducts(page = 1, limit = 10, search = '') {
        try {
            const skip = (page - 1) * limit;

            let query = {};
            if (search) {
                query = { $text: { $search: search } };
            }

            const products = await Product.find(query)
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 });

            const total = await Product.countDocuments(query);
            const totalPage = Math.ceil(total / limit);

            return {
                page,
                limit,
                total,
                totalPage,
                search: search || '',
                products
            };
        } catch (error) {
            throw error;
        }
    },

    async createProduct(productData) {
        try {
            const product = new Product(productData);
            await product.save();
            return product;
        } catch (error) {
            throw error;
        }
    },

    async updateProduct(id, productData) {
        try {
            const product = await Product.findByIdAndUpdate(
                id,
                { ...productData, updatedAt: Date.now() },
                { new: true, runValidators: true }
            );

            if (!product) {
                throw new Error('Product not found');
            }

            return product;
        } catch (error) {
            throw error;
        }
    },

    async deleteProduct(id) {
        try {
            const product = await Product.findByIdAndDelete(id);

            if (!product) {
                throw new Error('Product not found');
            }

            return true;
        } catch (error) {
            throw error;
        }
    }
};
