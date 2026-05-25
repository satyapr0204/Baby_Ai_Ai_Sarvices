module.exports = (sequelize, DataTypes) => {

    const Measurement = sequelize.define("Measurement", {

        height: DataTypes.FLOAT,
        weight: DataTypes.FLOAT,
        chest: DataTypes.FLOAT,
        waist: DataTypes.FLOAT,
        hip: DataTypes.FLOAT,
        recommended_size: DataTypes.STRING

    }, {
        tableName: "measurements",
        timestamps: true
    });

    return Measurement;

};
