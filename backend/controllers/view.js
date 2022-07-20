const Tour = require("../models/tours");
// const User = require("../models/users");
const AppError = require("../utils/appError");
const asyncHandler = require("../utils/catchAsync");

const base = (req, res, next) => {
  res.render("base");
};

const overview = asyncHandler(async (req, res, next) => {
  const tours = await Tour.find();

  res.render("overview", { tours, title: "Natours | All Tours" });
});

const tourDetail = asyncHandler(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  if (!tour) {
    return next(new AppError("There is no tour with that ID", 401));
  }
  res.render("tour", { tour, title: `${tour.name} Tour` });
});

const login = (req, res, next) => {
  res.render("login", { title: "Log in to your account" });
};

const signup = (req, res, next) => {
  res.render("signup", { title: "Sign up for an account" });
};

const userAccount = (req, res) => {
  res.render("account", {
    title: "Your account",
  });
};

module.exports = {
  overview,
  base,
  tourDetail,
  login,
  signup,
  userAccount
};
