const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;

const productSchema = new mongoose.Schema(
    {
        service: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32,
            unique: true
        },
        category: {
            type: ObjectId,
            ref: 'Category',
            required: true
        },
        ratePer1000: {
            type: Number,
            required: true,
        },
        pricePerUnit: {
            type: Number,
            required: true,
        },
        minOrder: {
            type: Number,
            required: true,
        },
        maxOrder: {
            type: Number,
            required: true,
        },
    }
);

module.exports = mongoose.model('Product', productSchema);