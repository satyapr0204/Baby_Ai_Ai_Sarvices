const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define("User", {
    name: DataTypes.STRING,
    gender: DataTypes.STRING,
    height: DataTypes.FLOAT,
    weight: DataTypes.FLOAT
});

module.exports = User;