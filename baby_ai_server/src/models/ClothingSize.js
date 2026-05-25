module.exports = (sequelize, DataTypes) => {

    const ClothingSize = sequelize.define("ClothingSize", {

        size: DataTypes.STRING,

        shirt_option1: DataTypes.STRING,
        shirt_option2: DataTypes.STRING,

        jeans_option1: DataTypes.STRING,
        jeans_option2: DataTypes.STRING,

        jacket_option1: DataTypes.STRING,
        jacket_option2: DataTypes.STRING

    });

    return ClothingSize;
};