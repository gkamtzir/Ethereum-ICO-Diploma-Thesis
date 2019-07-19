const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const api = require("./routes/api");

const app = express();
const port = 8080;

mongoose.connect("mongodb://localhost:27017/data", { useNewUrlParser: true });

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error: "));

// Establishing a conncetion with MongoDB.
db.once("open", function() {

    console.log("Connected");

});

// View engine setup.
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api", api);

// Catch 404 and forward to error handler.
app.use(function(req, res, next) {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
});

// Error handler.
app.use(function(err, req, res, next) {
    // Set locals, only providing error in development.
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // Render the error page.
    res.status(err.status || 500);
    res.render("error");
});

app.listen(port, () => console.log(`Listening on port ${port}!`));