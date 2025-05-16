import kafka, { TOPICS } from './config.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import path from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function connectToDatabase() {
    try {
        const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/produitservice';

        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('Consumer connected to MongoDB successfully');
        return mongoose.connection;
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        process.exit(1);
    }
}

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    stock: { type: Number, required: true, min: 0 },
    price: { type: Number, required: true, min: 0 },
}, { timestamps: true, versionKey: false });

productSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, converted) => {
        converted.id = converted._id;
        delete converted._id;
    }
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

const consumer = kafka.consumer({
    groupId: process.env.KAFKA_CONSUMER_GROUP || 'inventory-service',
    sessionTimeout: 30000
});

/**
 * @param {Object} orderData
 * @returns {Promise<void>}
 */
async function updateInventory(orderData) {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        console.log(`Processing inventory updates for order: ${orderData.orderId}`);

        for (const item of orderData.products) {
            const { productId, quantity } = item;

          
            if (!productId || !quantity) {
                console.warn(`Skipping invalid item: ${JSON.stringify(item)}`);
                continue;
            }

        
            const product = await Product.findById(productId).session(session);

            if (!product) {
                console.error(`Product not found: ${productId}`);
                continue;
            }

            if (product.stock < quantity) {
                console.error(`Insufficient stock for product ${productId}: requested ${quantity}, available ${product.stock}`);
                throw new Error(`Insufficient stock for product ${product.name}`);
            }

            product.stock -= quantity;
            await product.save({ session });

            console.log(`Updated stock for product ${productId}: new stock ${product.stock}`);
        }

        await session.commitTransaction();
        console.log(`Inventory update completed for order: ${orderData.orderId}`);
    } catch (error) {
        await session.abortTransaction();
        console.error('Failed to update inventory:', error);
        throw error;
    } finally {
        session.endSession();
    }
}

export async function runConsumer() {
    try {
        await connectToDatabase();

        await consumer.connect();
        console.log('Consumer connected to Kafka');

        await consumer.subscribe({
            topic: TOPICS.ORDER_CREATED,
            fromBeginning: false
        });

        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                try {
                    const orderData = JSON.parse(message.value.toString());
                    console.log(`Received order event: ${JSON.stringify(orderData)}`);

                    await updateInventory(orderData);

                    console.log('Order processed successfully');
                } catch (error) {
                    console.error('Error processing message:', error);
                }
            },
        });

        console.log(`Consumer started and listening for messages on topic: ${TOPICS.ORDER_CREATED}`);
    } catch (error) {
        console.error('Failed to start consumer:', error);
        await shutdown();
    }
}


async function shutdown() {
    try {
        if (consumer.isConnected) {
            await consumer.disconnect();
            console.log('Consumer disconnected');
        }

        if (mongoose.connection.readyState === 1) {
            await mongoose.connection.close();
            console.log('MongoDB connection closed');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error during consumer shutdown:', error);
        process.exit(1);
    }
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

if (import.meta.url === `file://${process.argv[1]}`) {
    runConsumer().catch(console.error);
}
