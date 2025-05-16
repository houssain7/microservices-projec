import dotenv from 'dotenv';
import { connectToDatabase } from './db/connection.js';
import Commande from './models/Commande.js';

dotenv.config();

const commandes = [
    {
        products: [
            { productId: '6462a8f53d5c3a001', quantity: 2 },
            { productId: '6462a8f53d5c3a002', quantity: 1 }
        ],
        price: 2499.97,
        status: 'completed'
    },
    {
        products: [
            { productId: '6462a8f53d5c3a003', quantity: 1 },
            { productId: '6462a8f53d5c3a004', quantity: 3 }
        ],
        price: 949.96,
        status: 'processing'
    },
    {
        products: [
            { productId: '6462a8f53d5c3a005', quantity: 2 }
        ],
        price: 799.98,
        status: 'pending'
    }
];

async function seedDatabase() {
    try {
        await connectToDatabase();

        await Commande.deleteMany({});
        console.log('Cleared existing commandes');

        const createdCommandes = await Commande.insertMany(commandes);
        console.log(`Seeded database with ${createdCommandes.length} commandes`);

        console.log('\nCreated commandes (with IDs):');
        createdCommandes.forEach(commande => {
            console.log(`- Commande ID: ${commande._id}, Price: ${commande.price}, Status: ${commande.status}`);
        });


        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();
