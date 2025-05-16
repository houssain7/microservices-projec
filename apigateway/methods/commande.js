export const commandeMethods = {
    getCommande: (client, id) => {
        return new Promise((resolve, reject) => {
            client.getCommande({ id }, (err, response) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(response);
                }
            });
        });
    },

    getCommandes: (client, { page, limit }) => {
        return new Promise((resolve, reject) => {
            client.getCommandes({ page, limit }, (err, response) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(response);
                }
            });
        });
    },

    createCommande: (client, commande) => {
        return new Promise((resolve, reject) => {
            client.createCommande({ commande }, (err, response) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(response);
                }
            });
        });
    },

    updateCommande: (client, id, commande) => {
        return new Promise((resolve, reject) => {
            client.updateCommande({ id, commande }, (err, response) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(response);
                }
            });
        });
    },

    deleteCommande: (client, id) => {
        return new Promise((resolve, reject) => {
            client.deleteCommande({ id }, (err, response) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(response);
                }
            });
        });
    },
};