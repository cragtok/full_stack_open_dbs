const router = require("express").Router();

const { Blog } = require("../models");
const { ValidationError } = require("sequelize");

const blogFinder = async (req, res, next) => {
    req.blog = await Blog.findByPk(req.params.id);
    next();
};

router.get("/", async (req, res) => {
    const blogs = await Blog.findAll();
    res.json(blogs);
});

router.get("/:id", blogFinder, async (req, res) => {
    const blog = req.blog;
    if (blog) {
        return res.json(blog);
    }
    res.status(404).end();
});

router.post("/", async (req, res) => {
    const blog = await Blog.create(req.body);
    return res.json(blog);
});

router.delete("/:id", blogFinder, async (req, res) => {
    const blog = req.blog;
    if (blog) {
        await blog.destroy();
        return res.status(204).end();
    }
    return res.status(404).end();
});

router.put("/:id", blogFinder, async (req, res) => {
    const blog = req.blog;
    if (blog) {
        if (req.body.likes == undefined) {
            throw new ValidationError();
        }
        blog.likes = req.body.likes;
        const savedBlog = await blog.save();
        return res.json(savedBlog);
    }
    return res.status(404).end();
});

module.exports = router;
