export const commandeController = {
    getCommande: (client, id) => {
        return new Promise((resolve, reject) => {
            client.getCommande({ id }, (err, response) => {
                if (err) {
                    console.error("Error fetching commande:", err);
                    reject(err);
                } else {
                    resolve(response.commande);
                }
            });
        });
    },

    getCommandeList: (client, page = 1, limit = 10) => {
        return new Promise((resolve, reject) => {
            client.getCommandes({ page, limit }, (err, response) => {
                if (err) {
                    console.error("Error fetching commandes:", err);
                    reject(err);
                } else {
                    resolve({
                        page: response.page,
                        limit: response.limit,
                        total: response.total,
                        totalPage: response.totalPage,
                        commandes: response.commandes,
                    });
                }
            });
        });
    },

    createCommande: (client, input) => {
        return new Promise((resolve, reject) => {
            client.createCommande({ commande: input }, (err, response) => {
                if (err) {
                    console.error("Error creating commande:", err);
                    reject(err);
                } else {
                    resolve(response.commande);
                }
            });
        });
    },

    updateCommande: (client, id, input) => {
        return new Promise((resolve, reject) => {
            client.updateCommande({ id, commande: input }, (err, response) => {
                if (err) {
                    console.error("Error updating commande:", err);
                    reject(err);
                } else {
                    resolve(response.commande);
                }
            });
        });
    },

    deleteCommande: (client, id) => {
        return new Promise((resolve, reject) => {
            client.deleteCommande({ id }, (err, response) => {
                if (err) {
                    console.error("Error deleting commande:", err);
                    reject(err);
                } else {
                    resolve(response.success);
                }
            });
        });
    },
};
