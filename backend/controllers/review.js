const Review = require("../models/review");
// const AppError = require("../utils/appError");
const asyncHandler = require("../utils/catchAsync");

exports.getReviews = asyncHandler(async (req, res, next) => {
  const reviews = await Review.find();
  return res.status(200).json({
    status: "success",
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  return res.status(200).json({
    status: "success",
    data: review,
  });
});

exports.addReview = asyncHandler(async (req, res, next) => {
  const newReview = await Review.create(req.body);
  return res.status(201).json({
    status: "success",
    newData: newReview,
  });
});

exports.patchReview = asyncHandler(async (req, res, next) => {
  const upForPatch = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  return res.status(200).json({
    status: "success",
    patchUser: upForPatch,
  });
});
