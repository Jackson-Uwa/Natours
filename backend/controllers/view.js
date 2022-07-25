const Tour = require("../models/tours");
const Booking = require("../models/booking");
const AppError = require("../utils/appError");
const asyncHandler = require("../utils/catchAsync");
// const {bookingCheckout} = require('../controllers/bookings')

const base = (req, res, next) => {
  res.render("base");
};

const overview = asyncHandler(async (req, res, next) => {
  const tours = await Tour.find();

  res.render("overview", { tours, title: "Natours | All Tours" });
});

const tourDetail = async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  if (!tour) {
    return next(new AppError("There is no tour with that ID", 401));
  }
  res.render("tour", { tour, title: `${tour.name} Tour` });
};

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

const myTours = asyncHandler(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user.id });
  // console.log(bookings);
  const tourIDs = bookings.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs } });
  // const tours = {
  //   name: "Forest Hiker",
  // };
  res.status(200).render("overview", {
    tours,
    title: "Booked Tours",
  });
  // res.redirect(`${req.protocol}://${req.get("host")}/`);
});

module.exports = {
  overview,
  base,
  tourDetail,
  login,
  signup,
  userAccount,
  myTours,
};
