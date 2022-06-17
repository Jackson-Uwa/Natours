const Tour = require("../models/tours");
const catchAsync = require("../utils/catchAsync");

const base = (req, res, next) => {
  res.status(200).render("base");
  
  next();
};

const overview = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();

  res.status(200).render("overview", { tours, title: "Natours" });
  next();
});

const tourDetail = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);

  res.status(200).render("tour", { tour, title: `${tour.name} Tour` });
  next();
});

module.exports = {
  overview,
  base,
  tourDetail,
};
