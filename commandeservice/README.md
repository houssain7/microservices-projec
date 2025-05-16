# Commande Service

A gRPC microservice for managing orders with MongoDB and Kafka integration.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (installed and running)
- npm or yarn
- Kafka (for event-driven inventory updates)

## Installation

1. Install dependencies:
```
npm install
```

## Configuration

Create a `.env` file in the root directory with the following content (adjust as needed):

```
PORT=5002
HOST=0.0.0.0
MONGODB_URI=mongodb://localhost:27017/commandeservice
LOG_LEVEL=info
```

## Database Setup

Seed the database with initial order data:

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

- `getCommande`: Get an order by ID
- `getCommandes`: Get a list of orders with pagination
- `createCommande`: Create a new order (also triggers Kafka event for inventory updates)
- `updateCommande`: Update an existing order
- `deleteCommande`: Delete an order

## Kafka Integration

When a new order is created, the service sends an event to Kafka to update product inventory. This is handled by the Kafka consumer service.

## Folder Structure

- `models/`: Mongoose models
- `repositories/`: Data access layer
- `handlers/`: gRPC service handlers
- `db/`: Database connection setup
- `utils/`: Utility functions (including Kafka integration)
- `server.js`: Main entry point
