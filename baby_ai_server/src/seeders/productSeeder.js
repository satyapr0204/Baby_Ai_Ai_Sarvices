const { Clothes } = require("../models");

async function seedProducts() {

    const products = [

        {
            name: "Blue T-Shirt",
            category: "tshirt",
            size: "M",
            price: 799,
            image: "t1.jpg"
        },

        {
            name: "Black Hoodie",
            category: "hoodie",
            size: "M",
            price: 1299,
            image: "h1.jpg"
        },

        {
            name: "White Shirt",
            category: "shirt",
            size: "S",
            price: 999,
            image: "s1.jpg"
        }

    ];

    for (const product of products) {

        await Clothes.findOrCreate({
            where: { name: product.name },
            defaults: product
        });

    }

}

module.exports = seedProducts;