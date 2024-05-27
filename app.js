var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
require("dotenv").config();
const cors = require("cors");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var ownerRouter = require("./routes/owner");
var propertyRouter = require("./routes/property");

var app = express();


// app.use(express.json({ limit: "50mb" }));
// app.use(express.urlencoded({ limit: "50mb" }));
app.use(express.json({ limit: "5mb" }));

app.use(cors());
app.options("*", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.status(200).send();
});

app.use(cors());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/owner", ownerRouter);
app.use("/property", propertyRouter);


// Route to get Google client ID
app.get("/api/google-client-id", (req, res) => {
  const clientId = process.env.CLIENT_ID;
  res.send(clientId);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});
const port = process.env.PORT;
app.listen(port || "4000");
console.log("listening on port" + port);
module.exports = app;