const jwt = require("jsonwebtoken");
const { SECRET } = require("../util/config");

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: `Unknown endpoint: ${req.url}` });
};

const errorHandler = (error, req, res, next) => {
    console.error("Error handler");
    console.error(error.name);

    let errorMessage = "Error";
    if (
        error.name === "SequelizeDatabaseError" ||
        error.name === "SequelizeValidationError" ||
        error.name === "SyntaxError"
    ) {
        if (req.method == "POST" || req.method == "PUT") {
            errorMessage = "Malformatted body";
        } else {
            errorMessage = "Malformatted id";
        }
    } else if (error.name === "SequelizeUniqueConstraintError") {
        if (
            req.path.startsWith("/api/users") &&
            (req.method === "POST" || req.method === "PUT")
        ) {
            errorMessage = "Username already exists";
        }
    } else if (error.name === "JsonWebTokenError") {
        errorMessage = "token invalid";
    }
    res.status(400).send({ error: errorMessage });

    next(error);
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
        return res.status(401).json({ error: "token missing" });
    }
    next();
};

module.exports = {
    unknownEndpoint,
    errorHandler,
    requestLogger,
    tokenExtractor,
};
