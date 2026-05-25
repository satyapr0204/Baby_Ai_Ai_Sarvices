module.exports = (sequelize, DataTypes) => {

    const Size = sequelize.define("Size", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        name: DataTypes.STRING,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    }, {
        tableName: "sizes",
        timestamps: true
    });

    return Size;

};
