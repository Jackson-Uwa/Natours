const Tour = require("../models/tours");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

//middle to get cheapest tours
const TopCheapTours = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};

const getTours = catchAsync(async (req, res) => {
  //BUILD QUERY
  //1a) Filtering
  const queryObj = { ...req.query };
  const excludedFields = ["page", "sort", "limit", "fields"];
  excludedFields.forEach((el) => delete queryObj[el]);

  //1b) Advanced Filtering
  //let queryStr = JSON.stringify(queryObj);
  //queryStr = queryStr.replace(/\b(gte|gt|lte|lt|in)\b/g, (match) => `$${match}`);
  // console.log(JSON.parse(queryStr));

  let query = Tour.find(queryObj);

  //2) Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  //3) Field limiting
  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    query = query.select(fields);
  } else {
    query = query.select("-__v");
  }

  //4) Pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 100;
  const skip = (page - 1) * limit;

  query = query.skip(skip).limit(limit);

  if (req.query.page) {
    const numTours = await Tour.countDocuments();
    if (skip >= numTours) throw new Error("This page does not exist");
  }

  //execute query
  const tours = await query;
  res.status(200);
  res.json({
    status: "success",
    results: tours.length,
    data: {
      tours,
    },
  });
});

const getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  // if (!tour)
  //   return next(new AppError(`No user with id: ${req.params.id}`, 401));
  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
});

const createTour = catchAsync(async (req, res) => {
  const newTour = await Tour.create(req.body);
  newTour.save();
  res.status(201).json({
    status: "success",
    data: {
      tour: newTour,
    },
  });
});

const updateTour = catchAsync(async (req, res) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
});

const deleteTour = catchAsync(async (req, res) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: "success",
    data: {
      tour,
    },
  });
});

module.exports = {
  getTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  TopCheapTours,
};
