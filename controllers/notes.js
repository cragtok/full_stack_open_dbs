const router = require("express").Router();

const { Note } = require("../models");
const { ValidationError } = require("sequelize");

const noteFinder = async (req, res, next) => {
    req.note = await Note.findByPk(req.params.id);
    next();
};

router.get("/", async (req, res) => {
    const notes = await Note.findAll();
    return res.json(notes);
});

router.post("/", async (req, res) => {
    const note = await Note.create(req.body);
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
