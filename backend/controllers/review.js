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

exports.getReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    return next(
      new AppError(`No review matching this ID ${req.params.id}`, 403)
    );
  }
  console.log("review");
  res.status(200).json({
    status: "success",
    data: review,
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

exports.patchReview = catchAsync(async (req, res, next) => {
  const upForPatch = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "success",
    patchUser: upForPatch,
  });
});

// module.exports = {
//   getReviews,
//   addReview
// };
