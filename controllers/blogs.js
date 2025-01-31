const router = require("express").Router();

const { Blog } = require("../models");

const blogFinder = async (req, res, next) => {
    try {
        req.blog = await Blog.findByPk(req.params.id);
    } catch (error) {
        return res.status(400).json({ error });
    }
    next();
};

router.get("/", async (req, res) => {
    const blogs = await Blog.findAll();
    console.log(JSON.stringify(blogs, null, 2));
    res.json(blogs);
});

router.get("/:id", blogFinder, async (req, res) => {
    const blog = req.blog;
    try {
        if (blog) {
            console.log(blog.toJSON());
            res.json(blog);
        } else {
            res.status(404).end();
        }
    } catch (error) {
        return res.status(400).json({ error });
    }
});

router.post("/", async (req, res) => {
    try {
        console.log(req.body);
        const blog = await Blog.create(req.body);
        return res.json(blog);
    } catch (error) {
        return res.status(400).json({ error });
    }
});

router.delete("/:id", blogFinder, async (req, res) => {
    const blog = req.blog;
    try {
        if (blog) {
            console.log(blog.toJSON());
            await blog.destroy();
            return res.status(204).end();
        } else {
            return res.status(404).end();
        }
    } catch (error) {
        return res.status(400).json({ error });
    }
});

router.put("/:id", blogFinder, async (req, res) => {
    const blog = req.blog;
    try {
        if (blog) {
            blog.likes = req.body.likes;
            const savedBlog = await blog.save();
            return res.json(savedBlog);
        } else {
            return res.status(404).end();
        }
    } catch (error) {
        return res.status(400).json({ error });
    }
});

module.exports = router;
