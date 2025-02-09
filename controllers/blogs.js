const router = require("express").Router();

const { Blog, User } = require("../models");
const { ValidationError, Op } = require("sequelize");
const { tokenExtractor, checkTokenValidity } = require("../util/middleware");

const blogFinder = async (req, res, next) => {
    req.blog = await Blog.findByPk(req.params.id);
    next();
};

router.get("/", async (req, res) => {
    const where = {};
    if (req.query.search) {
        where[Op.or] = {
            title: {
                [Op.iLike]: `%${req.query.search}%`,
            },

            author: {
                [Op.iLike]: `%${req.query.search}%`,
            },
        };
    }
    const blogs = await Blog.findAll({
        attributes: { exclude: ["userId"] },
        include: {
            model: User,
            attributes: ["name"],
        },
        where,
        order: [["likes", "DESC"]],
    });
    res.json(blogs);
});

router.get("/:id", blogFinder, async (req, res) => {
    const blog = req.blog;
    if (blog) {
        return res.json(blog);
    }
    res.status(404).end();
});

router.post("/", tokenExtractor, checkTokenValidity, async (req, res) => {
    const user = await User.findByPk(req.decodedToken.id);
    const blog = await Blog.create({
        ...req.body,
        userId: user.id,
    });
    return res.json(blog);
});

router.delete(
    "/:id",
    tokenExtractor,
    checkTokenValidity,
    blogFinder,
    async (req, res) => {
        const user = await User.findByPk(req.decodedToken.id);
        const blog = req.blog;
        if (blog) {
            if (!user || blog.userId !== user.id) {
                return res.status(401).end();
            }
            await blog.destroy();
            return res.status(204).end();
        }
        return res.status(404).end();
    }
);

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
