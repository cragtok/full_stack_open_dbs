const router = require("express").Router();

const { Note, User } = require("../models");
const { ValidationError, where } = require("sequelize");
const { tokenExtractor } = require("../util/middleware");

const noteFinder = async (req, res, next) => {
    req.note = await Note.findByPk(req.params.id);
    next();
};

router.get("/", async (req, res) => {
    const notes = await Note.findAll({
        attributes: { exclude: ["userId"] },
        include: {
            model: User,
            attributes: ["name"],
        },
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

router.delete("/:id", noteFinder, async (req, res) => {
    const note = req.note;
    if (note) {
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
