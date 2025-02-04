const router = require("express").Router();

const { Blog, User } = require("../models");
const { Op, fn, col } = require("sequelize");
const { tokenExtractor } = require("../util/middleware");

router.get("/", async (req, res) => {
    // SELECT author, COUNT(title) as articles, SUM(likes) as likes FROM blogs GROUP BY author ORDER BY likes DESC;
    const blogs = await Blog.findAll({
        group: "author",
        order: [["likes", "DESC"]],
        attributes: [
            "author",
            [fn("COUNT", col("title")), "articles"],
            [fn("SUM", col("likes")), "likes"],
        ],
    });
    res.json(blogs);
});

module.exports = router;
