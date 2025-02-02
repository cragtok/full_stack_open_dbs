const express = require("express");
require("express-async-errors");
const { PORT } = require("./util/config");
const { connectToDatabase } = require("./util/db");

const notesRouter = require("./controllers/notes");
const blogsRouter = require("./controllers/blogs");
const middleware = require("./util/middleware");

const app = express();
app.use(express.json());
app.use(middleware.requestLogger);
app.use("/api/notes", notesRouter);
app.use("/api/blogs", blogsRouter);
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

const start = async () => {
    await connectToDatabase();
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

start();
