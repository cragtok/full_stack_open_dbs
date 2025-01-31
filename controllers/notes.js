const router = require("express").Router();

const { Note } = require("../models");

const noteFinder = async (req, res, next) => {
    try {
        req.note = await Note.findByPk(req.params.id);
    } catch (error) {
        return res.status(400).json({ error });
    }
    next();
};

router.get("/", async (req, res) => {
    const notes = await Note.findAll();
    console.log(JSON.stringify(notes, null, 2));
    return res.json(notes);
});

router.post("/", async (req, res) => {
    try {
        console.log(req.body);
        const note = await Note.create(req.body);
        return res.json(note);
    } catch (error) {
        return res.status(400).json({ error });
    }
});

router.get("/:id", noteFinder, async (req, res) => {
    const note = req.note;
    try {
        if (note) {
            console.log(note.toJSON());
            return res.json(note);
        } else {
            return res.status(404).end();
        }
    } catch (error) {
        return res.status(400).json({ error });
    }
});

router.delete("/:id", noteFinder, async (req, res) => {
    const note = req.note;
    try {
        if (note) {
            await req.note.destroy();
            return res.status(204).end();
        } else {
            return res.status(404).end();
        }
    } catch (error) {
        return res.status(400).json({ error });
    }
});

router.put("/:id", noteFinder, async (req, res) => {
    const note = req.note;
    try {
        if (note) {
            note.important = req.body.important;
            const savedNote = await note.save();
            return res.json(savedNote);
        } else {
            return res.status(404).end();
        }
    } catch (error) {
        return res.status(400).json({ error });
    }
});

module.exports = router;
