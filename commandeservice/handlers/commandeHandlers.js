import { notifyOrderCreated } from '../utils/kafkaService.js';
import { commandeRepository } from '../repositories/commandeRepository.js';
import mongoose from 'mongoose';

// Helper to handle MongoDB ObjectId validation
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * Get a commande by ID
 * 
 * @param {Object} call - gRPC call object
 * @param {Function} callback - gRPC callback
 */
export const getCommande = async (call, callback) => {
    const { id } = call.request;

    try {
        // Validate ID format
        if (!isValidObjectId(id)) {
            return callback({
                code: 400,
                message: 'Invalid commande ID format'
            });
        }

        const commande = await commandeRepository.getCommandeById(id);
        callback(null, { commande });
    } catch (error) {
        console.error('getCommande error:', error);

        if (error.message === 'Commande not found') {
            callback({
                code: 404,
                message: 'Commande not found'
            });
        } else {
            callback({
                code: 500,
                message: 'Internal server error'
            });
        }
    }
};

/**
 * Get commandes with pagination
 * 
 * @param {Object} call - gRPC call object
 * @param {Function} callback - gRPC callback
 */
export const getCommandes = async (call, callback) => {
    const { page, limit } = call.request;

    try {
        const result = await commandeRepository.getCommandes(page, limit);
        callback(null, result);
    } catch (error) {
        console.error('getCommandes error:', error);
        callback({
            code: 500,
            message: 'Failed to retrieve commandes'
        });
    }
};

/**
 * Create a new commande and notify Kafka for inventory updates
 * 
 * @param {Object} call - gRPC call object
 * @param {Function} callback - gRPC callback
 */
export const createCommande = async (call, callback) => {
    const { commande } = call.request;

    try {
        // Create commande with calculated price
        const commandeData = {
            products: commande.products,
            price: await calculateTotalPrice(commande.products),
            status: 'pending'
        };

        // Save to database
        const newCommande = await commandeRepository.createCommande(commandeData);

        // Notify Kafka about the new order to update inventory
        const kafkaResult = await notifyOrderCreated(newCommande);

        if (!kafkaResult.success) {
            console.warn(`Order created but inventory notification failed: ${kafkaResult.error}`);
            // In a production system, you might want to implement:
            // 1. A retry mechanism
            // 2. A compensating transaction
            // 3. Move the order to a "pending inventory verification" status
        }

        // Return the created order
        callback(null, { commande: newCommande });
    } catch (error) {
        console.error('Error creating order:', error);
        callback({
            code: 500,
            message: `Failed to create order: ${error.message}`
        });
    }
};

/**
 * Update an existing commande
 * 
 * @param {Object} call - gRPC call object
 * @param {Function} callback - gRPC callback
 */
export const updateCommande = async (call, callback) => {
    const { id, commande } = call.request;

    try {
        // Validate ID format
        if (!isValidObjectId(id)) {
            return callback({
                code: 400,
                message: 'Invalid commande ID format'
            });
        }

        // Calculate new price if products have changed
        let updateData = { ...commande };
        if (commande.products && commande.products.length > 0) {
            updateData.price = await calculateTotalPrice(commande.products);
        }

        const updatedCommande = await commandeRepository.updateCommande(id, updateData);
        callback(null, { commande: updatedCommande });
    } catch (error) {
        console.error('updateCommande error:', error);

        if (error.message === 'Commande not found') {
            callback({
                code: 404,
                message: 'Commande not found'
            });
        } else if (error.name === 'ValidationError') {
            callback({
                code: 400,
                message: `Validation error: ${error.message}`
            });
        } else {
            callback({
                code: 500,
                message: 'Failed to update commande'
            });
        }
    }
};

/**
 * Delete a commande
 * 
 * @param {Object} call - gRPC call object
 * @param {Function} callback - gRPC callback
 */
export const deleteCommande = async (call, callback) => {
    const { id } = call.request;

    try {
        // Validate ID format
        if (!isValidObjectId(id)) {
            return callback({
                code: 400,
                message: 'Invalid commande ID format'
            });
        }

        await commandeRepository.deleteCommande(id);
        callback(null, { success: true });
    } catch (error) {
        console.error('deleteCommande error:', error);

        if (error.message === 'Commande not found') {
            callback({
                code: 404,
                message: 'Commande not found'
            });
        } else {
            callback({
                code: 500,
                message: 'Failed to delete commande'
            });
        }
    }
};

/**
 * Calculate total price of order (example function)
 * In a real application, you'd likely fetch product prices from the database
 * 
 * @param {Array} products - Array of products with quantity
 * @returns {Number} - Total price
 */
function calculateTotalPrice(products) {
    // This is just a placeholder function
    // In reality, you would fetch product prices from the database
    return products.reduce((total, item) => total + (item.quantity * 100), 0);
}
