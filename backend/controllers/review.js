const Review = require("../models/review");
// const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.getReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();
  res.status(200).json({
    status: "success",
    results: reviews.length,
    data: {
      reviews,
    },
  });
  next();
});

exports.getReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  res.status(200).json({
    status: "success",
    data: review,
  });
  next();
});

exports.addReview = catchAsync(async (req, res, next) => {
  const newReview = await Review.create(req.body);
  return res.status(201).json({
    status: "success",
    newData: newReview,
  });
});

exports.patchReview = catchAsync(async (req, res, next) => {
  const upForPatch = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  return res.status(200).json({
    status: "success",
    patchUser: upForPatch,
  });
});
