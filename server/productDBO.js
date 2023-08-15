const mongoose = require('mongoose');

// Course Modal Schema
const productSchema = new mongoose.Schema({
    id: Number,
    title: String,
    description: String,
    price: Number,
    discountPercentage: Number,
    rating: Number,
    stock: Number,
    brand: String,
    category: String,
    thumbnail: String,
    images: [String]
});

// Creating model objects
const Product = mongoose.model('shops', productSchema);

// Exporting our model objects
module.exports = {
    Product
}