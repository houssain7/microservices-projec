import kafka, { TOPICS } from './config.js';
import dotenv from 'dotenv';

dotenv.config();

const producer = kafka.producer();

/**
 * @param {Object} order 
 * @returns {Promise<void>}
 */
export async function sendOrderCreatedEvent(order) {
    try {
        if (!producer.isConnected) {
            await producer.connect();
            console.log('Producer connected to Kafka');
        }

        const message = {
            key: order.id || Date.now().toString(),
            value: JSON.stringify({
                orderId: order.id,
                products: order.products,
                timestamp: new Date().toISOString()
            })
        };

        await producer.send({
            topic: TOPICS.ORDER_CREATED,
            messages: [message]
        });

        console.log(`Order created event sent for order ID: ${order.id || 'N/A'}`);
    } catch (error) {
        console.error('Failed to send order created event:', error);
        throw error;
    }
}

export async function processNewOrder(order) {
    try {
        if (!order || !order.products || !Array.isArray(order.products) || order.products.length === 0) {
            throw new Error('Invalid order data. Must include products array.');
        }

        await sendOrderCreatedEvent(order);

        return { success: true, message: 'Order processed successfully' };
    } catch (error) {
        console.error('Error processing order:', error);
        return { success: false, error: error.message };
    }
}

async function shutdown() {
    try {
        if (producer.isConnected) {
            await producer.disconnect();
            console.log('Producer disconnected');
        }
        process.exit(0);
    } catch (error) {
        console.error('Error during producer shutdown:', error);
        process.exit(1);
    }
}


process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

if (import.meta.url === `file://${process.argv[1]}`) {
    const testOrder = {
        id: `order-${Date.now()}`,
        products: [
            { productId: '61234567890abcdef1234567', quantity: 2 },
            { productId: '61234567890abcdef1234568', quantity: 1 }
        ]
    };

    processNewOrder(testOrder)
        .then(result => {
            console.log('Test result:', result);
            return shutdown();
        })
        .catch(console.error);
}
