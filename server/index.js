const express = require('express');
const path = require('path');
const ProductDAO = require("./productDAO");

const PORT = process.env.PORT || 8080;

const app = express();
app.use(express.static(path.join(__dirname, '..', 'client')));
app.use(express.urlencoded({
    extended: true
}))

const productDb = new ProductDAO(path.join(__dirname, '..', '/data'));

/*** RETURNS HOME PAGE ***/
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client/index.html'))
});

/*** RETURNS FILTERED PRODUCTS ***/
app.get("/products", async (req, res) => {
    try {
        const filter = JSON.parse(decodeURIComponent(req.query["filter"]));
        const search = decodeURIComponent(req.query["search"]);

        const filteredProducts = await productDb.getFilteredProducts(filter, search);
        res.json(filteredProducts);
    } catch (err) {
        res.status(500).json({error: err});
    }
});

/*** RETURNS FILTERED PRODUCTS ***/
app.post('/products', async (req, res) => {
    try {
        const productData = req.body;
        await productDb.addProduct(productData);
        res.send('Color added successfully');
    } catch (err) {
        res.status(500).json({error: err});
    }
});

/*** RETURNS FILTERED PRODUCTS ***/
app.put('/products', async (req, res) => {
    const updatedProductData = req.body;
    console.log(updatedProductData);
    const productId = JSON.parse(decodeURIComponent(req.query["id"]));
    console.log(productId);

    try {
        await productDb.modifyProduct(updatedProductData, productId);
        console.log("updatedProductData");
        res.send(`Product with ID ${productId} modified successfully.`);
    } catch (err) {
        console.log(err);
        res.status(500).json({error: err});
    }
});

/*** RETURNS FILTERED PRODUCTS ***/
app.delete('/products/:id', async (req, res) => {
    const productId = req.params.id;
    try {
        await productDb.deleteProduct(productId);
        res.send(`Product with ID ${productId} deleted successfully.`);
    } catch (err) {
        res.status(500).json({error: err});
    }
});

/*** RETURNS FILTERED PRODUCTS ***/
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
