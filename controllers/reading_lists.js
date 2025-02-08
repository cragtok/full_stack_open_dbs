const router = require("express").Router();

const { Blog, User, ReadingList } = require("../models");
const { tokenExtractor } = require("../util/middleware");

router.post("/", tokenExtractor, async (req, res) => {
    const userId = req.body.userId;
    const blogId = req.body.blogId;

    const user = await User.findByPk(userId);
    const blog = await Blog.findByPk(blogId);

    const errorsArray = [];
    if (!user) {
        errorsArray.push("User with userId does not exist");
    }

    if (!blog) {
        errorsArray.push("Blog with blogId does not exist");
    }

    if (!user || !blog) {
        return res.status(404).json({ error: errorsArray });
    }

    const readingList = await ReadingList.create({
        userId,
        blogId,
    });

    return res.json(readingList);
});

module.exports = router;
