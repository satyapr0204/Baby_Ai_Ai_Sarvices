const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const BodyScan = sequelize.define("BodyScan", {

    user_id: DataTypes.INTEGER,

    chest: DataTypes.FLOAT,
    waist: DataTypes.FLOAT,
    hip: DataTypes.FLOAT,
    shoulder: DataTypes.FLOAT

});

module.exports = BodyScan;