const router = require("express").Router();

const { Blog, User, ReadingList } = require("../models");
const { tokenExtractor, checkTokenValidity } = require("../util/middleware");

router.post("/", tokenExtractor, checkTokenValidity, async (req, res) => {
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

router.put("/:id", tokenExtractor, checkTokenValidity, async (req, res) => {
    const user = await User.findByPk(req.decodedToken.id);
    const readingList = await ReadingList.findByPk(req.params.id);

    if (readingList) {
        if (!user || readingList.userId !== user.id) {
            return res.status(401).end();
        }
        readingList.read = req.body.read;
        const savedReadingList = await readingList.save();
        return res.json(savedReadingList);
    }

    return res.status(404).end();
});

module.exports = router;
