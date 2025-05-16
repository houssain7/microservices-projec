import { processNewOrder } from '../../kafka/producer.js';

/**
 * Sends a new order to Kafka for inventory processing
 * This function should be called after an order is successfully created
 * 
 * @param {Object} order - The order object with id and products
 * @returns {Promise<Object>} Result of the Kafka operation
 */
export async function notifyOrderCreated(order) {
    try {
        // Format the order data for Kafka
        const orderData = {
            id: order.id,
            products: order.products.map(product => ({
                productId: product.productId,
                quantity: product.quantity
            }))
        };

        // Send to Kafka producer
        const result = await processNewOrder(orderData);

        if (!result.success) {
            console.error(`Failed to send order to Kafka: ${result.error}`);
        } else {
            console.log(`Order ${order.id} successfully sent to Kafka for inventory processing`);
        }

        return result;
    } catch (error) {
        console.error('Error notifying order creation:', error);
        return { success: false, error: error.message };
    }
}
