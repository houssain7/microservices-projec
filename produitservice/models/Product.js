import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    price: {
        type: Number,
        required: true,
        min: 0
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

productSchema.index({ name: 'text', description: 'text' });

productSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, converted) => {
        converted.id = converted._id;
        delete converted._id;
    }
});

const Product = mongoose.model('Product', productSchema);

export default Product;
