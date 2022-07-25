const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      required: [true, "Must have booked tour"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Booked tour must have a user"],
    },
    price: {
      type: Number,
      required: [true, "Booking must have a price"],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    paid: {
      type: Boolean,
      default: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

bookingSchema.pre(/^find/, function (next) {
  this
  .populate({ path: "user", select: "name email" })
  .populate({
    path: "tour",
    select: "name",
  });
  next();
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
