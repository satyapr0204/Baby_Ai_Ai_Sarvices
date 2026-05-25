const { ClothingSize } = require("../models");

async function seedClothingSizes() {

    const data = [

        {
            size: "S",
            shirt_option1: "Small",
            shirt_option2: "Slim Small",
            jeans_option1: "28",
            jeans_option2: "30",
            jacket_option1: "Small",
            jacket_option2: "Slim Small"
        },

        {
            size: "M",
            shirt_option1: "Medium",
            shirt_option2: "Slim Medium",
            jeans_option1: "32",
            jeans_option2: "33",
            jacket_option1: "Medium",
            jacket_option2: "Slim Medium"
        },

        {
            size: "L",
            shirt_option1: "Large",
            shirt_option2: "Slim Large",
            jeans_option1: "34",
            jeans_option2: "35",
            jacket_option1: "Large",
            jacket_option2: "Slim Large"
        },

        {
            size: "XL",
            shirt_option1: "XL",
            shirt_option2: "Comfort XL",
            jeans_option1: "36",
            jeans_option2: "38",
            jacket_option1: "XL",
            jacket_option2: "Comfort XL"
        }

    ];

    for (const item of data) {

        await ClothingSize.findOrCreate({
            where: { size: item.size },
            defaults: item
        });

    }

}

module.exports = seedClothingSizes;