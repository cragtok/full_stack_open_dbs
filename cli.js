require("dotenv").config();
const { Sequelize, Model, DataTypes } = require("sequelize");
const express = require("express");
const app = express();

app.use(express.json());

const sequelize = new Sequelize(process.env.DATABASE_URL);

class Blog extends Model { }

Blog.init(
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        author: { type: DataTypes.TEXT },
        url: { type: DataTypes.TEXT, allowNull: false },
        title: { type: DataTypes.TEXT, allowNull: false },
        likes: { type: DataTypes.INTEGER, defaultValue: 0 },
    },
    { sequelize, underscored: true, timestamps: false, modelName: "blog" }
);

const main = async () => {
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");
        const blogs = await Blog.findAll();
        blogs.forEach(({ dataValues }) => {
            console.log(
                `${dataValues.author}: '${dataValues.title}', ${dataValues.likes} likes`
            );
        });
        sequelize.close();
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
};

main();
