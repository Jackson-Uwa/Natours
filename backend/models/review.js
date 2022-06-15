const mongoose = require("mongoose");
const Tour = require("../models/tours");
const User = require("../models/users");

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "Review cannot be empty"],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: { type: Date, default: Date.now(), select: false },
    tour: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Tour",
        required: [true, "Review must belong to a tour"],
      },
    ],
    user: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "Review must belong to a user"],
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.pre("save", async function (next) {
  const tours = this.tour.map(async (id) => await Tour.findById(id));
  const users = this.user.map(async (id) => await User.findById(id));
  this.tour = await Promise.all(tours);
  this.user = await Promise.all(users);
});

reviewSchema.pre(/^find/, function (next) {
  // this.populate({
  //   path: "tour",
  //   select: "-__v",
  // });
  this.populate({
    path: "user",
    select: "-__v -passwordChangedAt -passwordResetExpires -passwordResetToken",
  });
  next();
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
