export const productController = {
    getProduct: (client, id) => {
        return new Promise((resolve, reject) => {
            client.getProduct({ id }, (err, response) => {
                if (err) {
                    console.error("Error fetching product:", err);
                    reject(err);
                } else {
                    resolve(response.product);
                }
            });
        });
    },

    getProductList: (client, page = 1, limit = 10, search = "") => {
        return new Promise((resolve, reject) => {
            client.getProducts({ page, limit, search }, (err, response) => {
                if (err) {
                    console.error("Error fetching products:", err);
                    reject(err);
                } else {
                    resolve({
                        page: response.page,
                        limit: response.limit,
                        total: response.total,
                        totalPage: response.totalPage,
                        search: response.search,
                        products: response.products,
                    });
                }
            });
        });
    },

    createProduct: (client, input) => {
        return new Promise((resolve, reject) => {
            client.createProduct({ product: input }, (err, response) => {
                if (err) {
                    console.error("Error creating product:", err);
                    reject(err);
                } else {
                    resolve(response.product);
                }
            });
        });
    },

    updateProduct: (client, id, input) => {
        return new Promise((resolve, reject) => {
            client.updateProduct({ id, product: input }, (err, response) => {
                if (err) {
                    console.error("Error updating product:", err);
                    reject(err);
                } else {
                    resolve(response.product);
                }
            });
        });
    },

    deleteProduct: (client, id) => {
        return new Promise((resolve, reject) => {
            client.deleteProduct({ id }, (err, response) => {
                if (err) {
                    console.error("Error deleting product:", err);
                    reject(err);
                } else {
                    resolve(response.success);
                }
            });
        });
    },
};