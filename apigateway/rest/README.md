# REST API Documentation

## Base URL
`http://localhost:5000/api`

## Products API

### Get all products
- **URL:** `/products`
- **Method:** `GET`
- **Query Parameters:**
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 10)
  - `search` (optional): Search term for product name/description
- **Success Response:** 
  ```json
  {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPage": 3,
    "search": "laptop",
    "products": [
      {
        "id": "6462a8f53d5c3a001",
        "name": "Laptop Pro",
        "description": "High performance laptop",
        "stock": 50,
        "price": 1299.99
      },
      ...
    ]
  }
  ```

### Get a product
- **URL:** `/products/:id`
- **Method:** `GET`
- **URL Parameters:** 
  - `id`: Product ID
- **Success Response:**
  ```json
  {
    "id": "6462a8f53d5c3a001",
    "name": "Laptop Pro",
    "description": "High performance laptop",
    "stock": 50,
    "price": 1299.99
  }
  ```

### Create a product
- **URL:** `/products`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "name": "New Product",
    "description": "Product description",
    "stock": 100,
    "price": 299.99
  }
  ```
- **Success Response:**
  ```json
  {
    "id": "new-product-id",
    "name": "New Product",
    "description": "Product description",
    "stock": 100,
    "price": 299.99
  }
  ```

### Update a product
- **URL:** `/products/:id`
- **Method:** `PUT`
- **URL Parameters:**
  - `id`: Product ID
- **Body:**
  ```json
  {
    "name": "Updated Product",
    "stock": 150
  }
  ```
- **Success Response:**
  ```json
  {
    "id": "product-id",
    "name": "Updated Product",
    "description": "Product description",
    "stock": 150,
    "price": 299.99
  }
  ```

### Delete a product
- **URL:** `/products/:id`
- **Method:** `DELETE`
- **URL Parameters:**
  - `id`: Product ID
- **Success Response:**
  ```json
  {
    "success": true,
    "message": "Product deleted successfully"
  }
  ```

## Commandes API

### Get all commandes
- **URL:** `/commandes`
- **Method:** `GET`
- **Query Parameters:**
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 10)
- **Success Response:**
  ```json
  {
    "page": 1,
    "limit": 10,
    "total": 15,
    "totalPage": 2,
    "commandes": [
      {
        "id": "order-id",
        "products": [
          {
            "productId": "product-id",
            "quantity": 2
          }
        ],
        "price": 2599.98,
        "status": "pending"
      },
      ...
    ]
  }
  ```

### Get a commande
- **URL:** `/commandes/:id`
- **Method:** `GET`
- **URL Parameters:**
  - `id`: Commande ID
- **Success Response:**
  ```json
  {
    "id": "order-id",
    "products": [
      {
        "productId": "product-id",
        "quantity": 2
      }
    ],
    "price": 2599.98,
    "status": "pending"
  }
  ```

### Create a commande
- **URL:** `/commandes`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "products": [
      {
        "productId": "product-id-1",
        "quantity": 2
      },
      {
        "productId": "product-id-2",
        "quantity": 1
      }
    ]
  }
  ```
- **Success Response:**
  ```json
  {
    "id": "new-order-id",
    "products": [
      {
        "productId": "product-id-1",
        "quantity": 2
      },
      {
        "productId": "product-id-2",
        "quantity": 1
      }
    ],
    "price": 3499.97,
    "status": "pending"
  }
  ```

### Update a commande
- **URL:** `/commandes/:id`
- **Method:** `PUT`
- **URL Parameters:**
  - `id`: Commande ID
- **Body:**
  ```json
  {
    "products": [
      {
        "productId": "product-id-1",
        "quantity": 3
      }
    ],
    "status": "processing"
  }
  ```
- **Success Response:**
  ```json
  {
    "id": "order-id",
    "products": [
      {
        "productId": "product-id-1",
        "quantity": 3
      }
    ],
    "price": 3899.97,
    "status": "processing"
  }
  ```

### Delete a commande
- **URL:** `/commandes/:id`
- **Method:** `DELETE`
- **URL Parameters:**
  - `id`: Commande ID
- **Success Response:**
  ```json
  {
    "success": true,
    "message": "Commande deleted successfully"
  }
  ```
