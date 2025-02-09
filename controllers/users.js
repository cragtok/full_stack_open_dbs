const router = require("express").Router();
const { User, Note, Blog, Team } = require("../models");
const { tokenExtractor, checkTokenValidity } = require("../util/middleware");

const isAdmin = async (req, res, next) => {
    const user = await User.findByPk(req.decodedToken.id);
    if (!user.admin) {
        return res.status(401).json({ error: "operation not allowed" });
    }
    next();
};

router.get("/", async (req, res) => {
    const users = await User.findAll({
        include: [
            {
                model: Note,
                attributes: { exclude: ["userId"] },
            },
            {
                model: Note,
                as: "marked_notes",
                attributes: { exclude: ["userId"] },
                through: {
                    attributes: [],
                },
                include: { model: User, attributes: ["name"] },
            },
            {
                model: Blog,
                attributes: { exclude: ["userId"] },
            },
            {
                model: Team,
                attributes: ["name", "id"],
                through: { attributes: [] },
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
    const where = {};
    if (req.query.read) {
        where.read = req.query.read === "true";
    }

    const user = await User.findByPk(req.params.id, {
        include: [
            {
                model: Note,
                attributes: { exclude: ["userId"] },
            },
            {
                model: Note,
                as: "marked_notes",
                attributes: { exclude: ["userId"] },
                through: {
                    attributes: [],
                },
                include: { model: User, attributes: ["name"] },
            },
            {
                model: Blog,
                attributes: { exclude: ["userId"] },
            },
            {
                model: Blog,
                as: "readings",
                attributes: { exclude: ["userId"] },
                through: {
                    as: "readinglists",
                    attributes: ["read", "id"],
                    where,
                },
            },
            {
                model: Team,
                attributes: ["name", "id"],
                through: { attributes: [] },
            },
        ],
    });

    if (!user) {
        return res.status(404).end();
    }

    let teams = undefined;
    if (req.query.teams) {
        teams = await user.getTeams({
            attributes: ["name"],
            joinTableAttributes: [],
        });
    }

    return res.json({ ...user.toJSON(), teams });
});

router.put(
    "/:username",
    tokenExtractor,
    checkTokenValidity,
    isAdmin,
    async (req, res) => {
        const user = await User.findOne({
            where: { username: req.params.username },
        });

        if (user) {
            user.disabled = req.body.disabled;
            await user.save();
            res.json(user);
        } else {
            res.status(404).end();
        }

        return res.status(404).end();
    }
);

module.exports = router;
