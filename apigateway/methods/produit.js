export const produitMethods = {
    getProduct: (client, id) => {
        return new Promise((resolve, reject) => {
            client.getProduct({ id }, (err, response) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(response);
                }
            });
        });
    },

    getProducts: (client, { page, limit, search }) => {
        return new Promise((resolve, reject) => {
            client.getProducts({ page, limit, search }, (err, response) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(response);
                }
            });
        });
    },

    createProduct: (client, product) => {
        return new Promise((resolve, reject) => {
            client.createProduct({ product }, (err, response) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(response);
                }
            });
        });
    },

    updateProduct: (client, id, product) => {
        return new Promise((resolve, reject) => {
            client.updateProduct({ id, product }, (err, response) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(response);
                }
            });
        });
    },

    deleteProduct: (client, id) => {
        return new Promise((resolve, reject) => {
            client.deleteProduct({ id }, (err, response) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(response);
                }
            });
        });
    },
};