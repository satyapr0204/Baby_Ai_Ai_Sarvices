module.exports = (sequelize, DataTypes) => {

    const Clothes = sequelize.define("Clothes", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        product_id: DataTypes.STRING,
        product_name: DataTypes.STRING,
        description: DataTypes.TEXT,
        msrp_price: DataTypes.FLOAT,
        sale_price: DataTypes.FLOAT,
        wholesale_cost: DataTypes.FLOAT,
        product_images: DataTypes.TEXT,
        product_url: DataTypes.TEXT,
        is_best_seller: DataTypes.BOOLEAN,
        retailer_id: DataTypes.INTEGER,
        fabric_id: DataTypes.INTEGER,
        color_id: DataTypes.INTEGER,
        size_id: DataTypes.INTEGER,
        gender_id: DataTypes.INTEGER,
        brand_id: DataTypes.INTEGER,
        category_id: DataTypes.INTEGER
    }, {
        tableName: "products",
        timestamps: true
    });

    return Clothes;

};
