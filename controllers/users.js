const router = require("express").Router();
const { User, Note, Blog } = require("../models");
const { tokenExtractor } = require("../util/middleware");

router.get("/", async (req, res) => {
    const users = await User.findAll({
        include: [
            {
                model: Note,
                attributes: { exclude: ["userId"] },
            },
            {
                model: Blog,
                attributes: { exclude: ["userId"] },
            },
        ],
    });
    return res.json(users);
});

router.post("/", async (req, res) => {
    const user = await User.create(req.body);
    return res.json(user);
});

router.get("/:id", async (req, res) => {
    const user = await User.findByPk(req.params.id, {
        include: [
            {
                model: Note,
                attributes: { exclude: ["userId"] },
            },
            {
                model: Blog,
                attributes: { exclude: ["userId"] },
            },
        ],
    });
    if (user) {
        return res.json(user);
    }
    return res.status(404).end();
});

router.put("/:username", tokenExtractor, async (req, res) => {
    const user = await User.findOne({
        where: { username: req.params.username },
    });

    if (user) {
        if (req.decodedToken.id !== user.id) {
            return res.status(401).end();
        }

        user.username = req.body.username;
        const updatedUser = await user.save();
        return res.json(updatedUser);
    }

    return res.status(404).end();
});

module.exports = router;
