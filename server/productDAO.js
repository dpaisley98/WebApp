const fs = require('fs');
const mongoose = require('mongoose');
const {Product} = require("./productDBO");

class ProductDAO {
    constructor(dirPath) {
        this.dirPath = dirPath;

        mongoose.connect('mongodb://127.0.0.1:27017/CA_4',
            { useNewUrlParser: true, useUnifiedTopology: true,})
            .then(() => {
                console.log('Connected to MongoDB')
                this.collectionExists("shops")
                    .then((exists) => {
                        if(!exists) {
                            this.createCollection();
                        }
                    });

                Product.findOne({}, {}, { sort: { '_id' : -1 } })
                    .then(product => {
                        this.currentId = product.id;
                    })


            })
            .catch((error) => console.log(error));
    }

    getFilteredProducts(filter, search) {
        return new Promise((resolve, reject) => {
            let query = filter || {};
            let minPrice;
            let maxPrice;
            console.log("min" + filter.price);

            if(filter.price) {
                minPrice = filter.price.$gte || 0;
                console.log("min" + minPrice);
                maxPrice =  filter.price.$lte || 99999;
                console.log("max" + maxPrice);
            }

            if (filter.title || filter.brand || filter.description || filter.category) {
                const orFilter = [];
                if (filter.title) {
                    orFilter.push({ title: { $regex: search, $options: "i" } });
                }
                if (filter.brand) {
                    orFilter.push({ brand: { $regex: search, $options: "i" } });
                }
                if (filter.description) {
                    orFilter.push({ description: { $regex: search, $options: "i" } });
                }
                if (filter.category) {
                    orFilter.push({ category: { $regex: search, $options: "i" } });
                }

                if(filter.price) {
                    const andFilter = [];
                    andFilter.push({price : {$gte : minPrice}});
                    andFilter.push({price : {$lte : maxPrice}});
                    query = { $or: orFilter, $and: andFilter };

                } else {
                    query = { $or: orFilter };
                }
            } else if ((search !== "undefined") && filter.price) {
                const andFilter = [];
                andFilter.push({price : {$gte : minPrice}});
                andFilter.push({price : {$lte : maxPrice}});
                andFilter.push({ title : { $regex: search, $options: "i" } });
                query = { $and : andFilter };
            } else if ((search !== "undefined")) {
                query = { title : { $regex: search, $options: "i" } };
            }

            console.log(query);

            Product.find(query)
                .then(products => {
                    resolve(products);
                })
                .catch(error => {
                    reject(new Error(`Error retrieving products: ${error}`));
                })
        });
    }

    addProduct(productData) {
        return new Promise((resolve, reject) => {
            const newProductData = {
                id: ++this.currentId,
                ...productData
            };

            Product.create(newProductData)
                .catch(error =>{
                    reject(new Error(`Error saving product ${newProductData.title}: ${error}`));
                });
        });
    }

    modifyProduct(updatedProductData, productId) {
        return new Promise((resolve, reject) => {
            Product.findOneAndUpdate({_id : productId}, updatedProductData)
                .then((data) =>{
                    resolve(`Product ${productId} updated successfully`);
                })
                .catch((error) => {
                    reject(new Error(`Error updating product ${productId}: ${error}`))
                });
        });
    }

    deleteProduct(productId) {
        return new Promise((resolve, reject) => {
            Product.findOneAndDelete({ _id : productId })
                .then(() => {
                    resolve(`Product ${productId} deleted successfully`);
                    this.currentId--;
                })
                .catch((error) => {
                    reject(new Error(`Error deleting product ${productId}: ${error}`));
                });
        });
    }

    collectionExists(collectionName) {
        return mongoose.connection.db.listCollections({ name: collectionName })
            .next((error, collectionInfo) => {
                if (error) {
                    console.error(`Error checking collection ${collectionName}: ${error}`);
                    return false;
                }
                return collectionInfo !== null;
            });
    }

    createCollection() {
        let rawJson = fs.readFileSync(this.dirPath + '/products.json');
        const data = JSON.parse(rawJson);
        data["products"].forEach(function (productData) {
            Product.create(productData)
                .catch(error =>{
                    throw new Error(`Error saving product ${productData.title}: ${error}`);
                });
        });
    }
}

module.exports = ProductDAO;
