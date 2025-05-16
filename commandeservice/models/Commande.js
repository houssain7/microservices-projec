import mongoose from 'mongoose';

// Define ProductDetail schema
const productDetailSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    }
}, { _id: false });

// Define Commande schema
const commandeSchema = new mongoose.Schema({
    products: {
        type: [productDetailSchema],
        required: true,
        validate: {
            validator: function (products) {
                return products.length > 0;
            },
            message: 'Order must contain at least one product'
        }
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'cancelled'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    versionKey: false
});

// Convert _id to id in responses
commandeSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, converted) => {
        converted.id = converted._id;
        delete converted._id;
    }
});

// Create the model
const Commande = mongoose.model('Commande', commandeSchema);

export default Commande;
