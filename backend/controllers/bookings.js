const Tour = require("../models/tours");
const Booking = require("../models/booking");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const asyncHandler = require("../utils/catchAsync");
const factory = require("../controllers/factory");

const checkOutSession = asyncHandler(async (req, res, next) => {
  const tour = await Tour.findById(req.params.tourID);
  //   console.log(tour);
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    success_url: `${req.protocol}://${req.get("host")}/?tour=${
      req.params.tourID
    }&&user=${req.user.id}&&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get("host")}/tour/${tour._id}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourID,
    line_items: [
      {
        name: `${tour.name} Tour`,
        description: tour.summary,
        images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
        amount: tour.price * 100,
        currency: "usd",
        quantity: 1,
      },
    ],
  });
  // console.log(session);
  res.status(200).json({
    status: "success",
    session,
  });
});

const bookingCheckout = asyncHandler(async (req, res, next) => {
  const { tour, user, price } = req.query;
  if (!tour && !user && !price) return next();
  await Booking.create({ tour, user, price });
  res.redirect(req.originalUrl.split("?")[0]);
});

const createBooking = asyncHandler(async (req, res, next) => {
  // const bookings = factory.createOne(Booking);
  const bookings = await Booking.create(req.body);
  res.status(200).json({
    status: "success",
    data: {
      data: bookings,
    },
  });
});

const getBookings = asyncHandler(async (req, res, next) => {
  const bookings = await Booking.find();
  res.status(200).json({
    status: "success",
    results: bookings.length,
    data: {
      data: bookings,
    },
  });
});

module.exports = {
  checkOutSession,
  bookingCheckout,
  createBooking,
  getBookings,
};
