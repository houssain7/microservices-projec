import Commande from '../models/Commande.js';

// Repository layer for interacting with the database
export const commandeRepository = {
    // Get a commande by ID
    async getCommandeById(id) {
        try {
            const commande = await Commande.findById(id);
            if (!commande) {
                throw new Error('Commande not found');
            }
            return commande;
        } catch (error) {
            throw error;
        }
    },

    // Get commandes with pagination
    async getCommandes(page = 1, limit = 10) {
        try {
            const skip = (page - 1) * limit;

            // Execute query with pagination
            const commandes = await Commande.find()
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 });

            // Get total count for pagination
            const total = await Commande.countDocuments();
            const totalPage = Math.ceil(total / limit);

            return {
                page,
                limit,
                total,
                totalPage,
                commandes
            };
        } catch (error) {
            throw error;
        }
    },

    // Create a new commande
    async createCommande(commandeData) {
        try {
            const commande = new Commande(commandeData);
            await commande.save();
            return commande;
        } catch (error) {
            throw error;
        }
    },

    // Update a commande
    async updateCommande(id, commandeData) {
        try {
            const commande = await Commande.findByIdAndUpdate(
                id,
                { ...commandeData, updatedAt: Date.now() },
                { new: true, runValidators: true }
            );

            if (!commande) {
                throw new Error('Commande not found');
            }

            return commande;
        } catch (error) {
            throw error;
        }
    },

    // Delete a commande
    async deleteCommande(id) {
        try {
            const commande = await Commande.findByIdAndDelete(id);

            if (!commande) {
                throw new Error('Commande not found');
            }

            return true;
        } catch (error) {
            throw error;
        }
    }
};
