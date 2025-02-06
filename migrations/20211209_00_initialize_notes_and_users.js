const { DataTypes } = require("sequelize");

module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.createTable("users", {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            username: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
                validate: {
                    isEmail: true,
                },
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        });
        await queryInterface.createTable("notes", {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            content: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            important: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
            },
            date: {
                type: DataTypes.DATE,
            },
        });
        await queryInterface.createTable("blogs", {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            author: { type: DataTypes.TEXT },
            url: { type: DataTypes.TEXT, allowNull: false },
            title: { type: DataTypes.TEXT, allowNull: false },
            likes: { type: DataTypes.INTEGER, defaultValue: 0 },
        });

        await queryInterface.addColumn("users", "created_at", {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        });
        await queryInterface.addColumn("blogs", "created_at", {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        });

        await queryInterface.addColumn("users", "updated_at", {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        });
        await queryInterface.addColumn("blogs", "updated_at", {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        });

        await queryInterface.addColumn("notes", "user_id", {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: "users", key: "id" },
        });
        await queryInterface.addColumn("blogs", "user_id", {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: "users", key: "id" },
        });
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.dropTable("notes");
        await queryInterface.dropTable("users");
        await queryInterface.dropTable("blogs");
    },
};
