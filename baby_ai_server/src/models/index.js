const Sequelize = require("sequelize");
const sequelize = require("../../config/database");

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Measurement = require("./Measurement")(sequelize, Sequelize);
db.Clothes = require("./Clothes")(sequelize, Sequelize);
db.Size = require("./Size")(sequelize, Sequelize);

module.exports = db;
