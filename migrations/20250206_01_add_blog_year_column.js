const { DataTypes } = require("sequelize");

module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.addColumn("blogs", "year", {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: true,
                min: {
                    args: [1991],
                    msg: "Year must be greater than or equal to 1991",
                },
                max: {
                    args: [new Date().getFullYear()],
                    msg: "Year cannot be greater than the current year",
                },
            },
        });
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.removeColumn("blogs", "year");
    },
};
