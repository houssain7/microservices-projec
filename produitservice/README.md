# Product Service

A gRPC microservice for managing products with MongoDB integration.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (installed and running)
- npm or yarn

## Installation

1. Install dependencies:
```
npm install
```

## Configuration

Create a `.env` file in the root directory with the following content (adjust as needed):

```
PORT=5001
HOST=0.0.0.0
MONGODB_URI=mongodb://localhost:27017/produitservice
LOG_LEVEL=info
```

## Database Setup

Seed the database with initial product data:

```
node seed.js
```

## Running the Service

Start the service:

```
npm start
```

For development with auto-reload:

```
npm run dev
```

## Service Endpoints

The service implements the following gRPC endpoints:

- `getProduct`: Get a product by ID
- `getProducts`: Get a list of products with pagination and search
- `createProduct`: Create a new product
- `updateProduct`: Update an existing product
- `deleteProduct`: Delete a product

## Folder Structure

- `models/`: Mongoose models
- `repositories/`: Data access layer
- `handlers/`: gRPC service handlers
- `db/`: Database connection setup
- `server.js`: Main entry point
