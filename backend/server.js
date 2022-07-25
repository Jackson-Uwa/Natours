const express = require("express");
require("dotenv").config();
const app = express();
const AppError = require("./utils/appError");
const globalErrorHandler = require("./utils/globalError");
const connectDB = require("./config/db");

const compression = require("compression");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const xss = require("xss-clean");
const hpp = require("hpp");
const mongoSanitize = require("express-mongo-sanitize");

const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Connect to DataBase
connectDB();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "..", "public")));
// app.use(express.static(`${__dirname}/../public`));
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(cookieParser());
app.use(compression())
// app.use((req, res, next) => {
//   console.log(req.cookies);
//   next();
// });

//set secure HTTP headers
app.use(helmet());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data Saniization & Prevention against cross site scripting 'xss'
app.use(xss());

// Prevention from parameter pollution
app.use(
  hpp({
    whitelist: "",
  })
);

// Limit requests from same Api/host/
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many request from this IP, please try again in an hour",
});
app.use("/api", limiter);

//endpoints and resources

app.use("/", require("./routes/view"));

app.use("/api/v1/reviews", require("./routes/reviews"));
app.use("/api/v1/users", require("./routes/users"));
app.use("/api/v1/tours", require("./routes/tours"));
app.use("/api/v1/bookings", require("./routes/bookings"));

//operational error to handle undefined routes
app.all("*", (req, res, next) => {
  // next(new AppError(`Cant find ${req.originalUrl} on this server!`, 404));
  if (req.accepts("json")) {
    res.render("error", { title: "Page 404" });
  }
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else {
    res.type("txt").send("404, Not Found");
  }
  next();
});

app.use(globalErrorHandler);

//START SERVER
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});
