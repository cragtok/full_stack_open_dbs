const { DataTypes } = require("sequelize");

module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.createTable("sessions", {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            token: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: "users", key: "id" },
            },
        });
        await queryInterface.addColumn("sessions", "created_at", {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        });
        await queryInterface.addColumn("sessions", "updated_at", {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        });
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.dropTable("sessions");
    },
};
