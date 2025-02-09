const router = require("express").Router();
const jwt = require("jsonwebtoken");
const { SECRET } = require("../util/config");
const { tokenExtractor } = require("../util/middleware");
const Session = require("../models/session");

router.delete("/", tokenExtractor, async (req, res) => {
    const session = await Session.findOne({
        where: { userId: req.decodedToken.id },
    });
    if (session) {
        await session.destroy();
    }
    return res.status(204).end();
});

module.exports = router;
