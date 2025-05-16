import { Kafka } from 'kafkajs';
import dotenv from 'dotenv';

dotenv.config();

const kafka = new Kafka({
    clientId: process.env.KAFKA_CLIENT_ID || 'order-processing',
    brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(',')
});

export const TOPICS = {
    ORDER_CREATED: 'order-created',
    INVENTORY_UPDATED: 'inventory-updated'
};

export default kafka;
