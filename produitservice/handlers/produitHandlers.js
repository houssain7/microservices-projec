import { productRepository } from '../repositories/productRepository.js';
import mongoose from 'mongoose';

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const produitHandlers = {
    getProduct: async (call, callback) => {
        const { id } = call.request;

        try {
            if (!isValidObjectId(id)) {
                return callback({
                    code: 400,
                    message: 'Invalid product ID format'
                });
            }

            const product = await productRepository.getProductById(id);
            callback(null, { product });
        } catch (error) {
            console.error('getProduct error:', error);

            if (error.message === 'Product not found') {
                callback({
                    code: 404,
                    message: 'Product not found'
                });
            } else {
                callback({
                    code: 500,
                    message: 'Internal server error'
                });
            }
        }
    },

    getProducts: async (call, callback) => {
        const { page, limit, search } = call.request;

        try {
            const result = await productRepository.getProducts(page, limit, search);
            callback(null, result);
        } catch (error) {
            console.error('getProducts error:', error);
            callback({
                code: 500,
                message: 'Failed to retrieve products'
            });
        }
    },

    createProduct: async (call, callback) => {
        const { product } = call.request;

        try {
            const newProduct = await productRepository.createProduct(product);
            callback(null, { product: newProduct });
        } catch (error) {
            console.error('createProduct error:', error);

            if (error.name === 'ValidationError') {
                callback({
                    code: 400,
                    message: `Validation error: ${error.message}`
                });
            } else {
                callback({
                    code: 500,
                    message: 'Failed to create product'
                });
            }
        }
    },

    updateProduct: async (call, callback) => {
        const { id, product } = call.request;

        try {
            if (!isValidObjectId(id)) {
                return callback({
                    code: 400,
                    message: 'Invalid product ID format'
                });
            }

            const updatedProduct = await productRepository.updateProduct(id, product);
            callback(null, { product: updatedProduct });
        } catch (error) {
            console.error('updateProduct error:', error);

            if (error.message === 'Product not found') {
                callback({
                    code: 404,
                    message: 'Product not found'
                });
            } else if (error.name === 'ValidationError') {
                callback({
                    code: 400,
                    message: `Validation error: ${error.message}`
                });
            } else {
                callback({
                    code: 500,
                    message: 'Failed to update product'
                });
            }
        }
    },

    deleteProduct: async (call, callback) => {
        const { id } = call.request;

        try {
            if (!isValidObjectId(id)) {
                return callback({
                    code: 400,
                    message: 'Invalid product ID format'
                });
            }

            await productRepository.deleteProduct(id);
            callback(null, { success: true });
        } catch (error) {
            console.error('deleteProduct error:', error);

            if (error.message === 'Product not found') {
                callback({
                    code: 404,
                    message: 'Product not found'
                });
            } else {
                callback({
                    code: 500,
                    message: 'Failed to delete product'
                });
            }
        }
    }
};
