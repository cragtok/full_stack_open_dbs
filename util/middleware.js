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

module.exports = { unknownEndpoint, errorHandler, requestLogger };
