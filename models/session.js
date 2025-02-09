const { Model, DataTypes } = require("sequelize");

const { sequelize } = require("../util/db");

class Session extends Model {}

Session.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        token: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: "users", key: "id" },
        },
    },
    {
        sequelize,
        underscored: true,
        timestamps: true,
        modelName: "sessions",
    }
);

module.exports = Session;
