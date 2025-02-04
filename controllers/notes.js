const router = require("express").Router();

const { Note, User } = require("../models");
const { ValidationError, Op } = require("sequelize");
const { tokenExtractor } = require("../util/middleware");

const noteFinder = async (req, res, next) => {
    req.note = await Note.findByPk(req.params.id);
    next();
};

router.get("/", async (req, res) => {
    const where = {};

    if (req.query.important) {
        where.important = req.query.important === "true";
    }

    if (req.query.search) {
        where.content = {
            [Op.substring]: req.query.search,
        };
    }

    const notes = await Note.findAll({
        attributes: { exclude: ["userId"] },
        include: {
            model: User,
            attributes: ["name"],
        },
        where,
    });

    return res.json(notes);
});

router.post("/", tokenExtractor, async (req, res) => {
    const user = await User.findByPk(req.decodedToken.id);
    const note = await Note.create({
        ...req.body,
        userId: user.id,
        date: new Date(),
    });
    return res.json(note);
});

router.get("/:id", noteFinder, async (req, res) => {
    const note = req.note;
    if (note) {
        return res.json(note);
    }
    return res.status(404).end();
});

router.delete("/:id", tokenExtractor, noteFinder, async (req, res) => {
    const user = await User.findByPk(req.decodedToken.id);
    const note = req.note;
    if (note) {
        if (!user || note.userId !== user.id) {
            return res.status(401).end();
        }
        await req.note.destroy();
        return res.status(204).end();
    }
    return res.status(404).end();
});

router.put("/:id", noteFinder, async (req, res) => {
    const note = req.note;
    if (note) {
        if (req.body.important == undefined) {
            throw new ValidationError();
        }
        note.important = req.body.important;
        const savedNote = await note.save();
        return res.json(savedNote);
    }
    return res.status(404).end();
});

module.exports = router;
