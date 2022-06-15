const Review = require("../models/review");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.getReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();
  // if (!reviews) {
  //   return next(new AppError("Sorry You have no reviews currently"), 404);
  // }
  res.status(200).json({
    status: "success",
    results: reviews.length,
    data: {
      reviews,
    },
  });
  next();
});

exports.addReview = catchAsync(async (req, res, next) => {
  const newReview = await Review.create(req.body);
  if (!newReview.review || !newReview.rating) {
    return next(new AppError("Review and a rating is needed", 404));
  }
  res.status(201).json({
    status: "success",
    newData: newReview,
  });
  next();
});

// module.exports = {
//   getReviews,
//   addReview
// };
