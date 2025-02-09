const jwt = require("jsonwebtoken");
const { SECRET } = require("../util/config");
const { User } = require("../models");

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: [`Unknown endpoint: ${req.url}`] });
};

const errorHandler = (error, req, res, next) => {
    console.error("Error handler");
    console.error(error.name);
    // console.error(error);

    if (error.name === "SyntaxError") {
        return res.status(400).send({ error: ["malformatted body"] });
    }

    if (error.errors) {
        return res
            .status(400)
            .send({ error: error.errors.map((error) => error.message) });
    } else {
        return res.status(400).send({ error: [error.message] });
    }
};

const requestLogger = (request, response, next) => {
    console.log("Method:", request.method);
    console.log("Path:  ", request.path);
    console.log("Body:  ", request.body);
    console.log("---");
    next();
};

const tokenExtractor = (req, res, next) => {
    const authorization = req.get("authorization");
    if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
        req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
    } else {
        return res.status(401).json({ error: ["token missing"] });
    }
    next();
};

const checkTokenValidity = async (req, res, next) => {
    const user = await User.findByPk(req.decodedToken.id);

    if (!user || user.disabled) {
        return res.status(401).json({ error: ["token invalid"] });
    }

    next();
};

module.exports = {
    unknownEndpoint,
    errorHandler,
    requestLogger,
    tokenExtractor,
    checkTokenValidity,
};
