const Tour = require("../models/tours");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const asyncHandler = require("../utils/catchAsync");

const checkOutSession = asyncHandler(async (req, res, next) => {
  const tour = await Tour.findById(req.params.tourID);
  //   console.log(tour);
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    success_url: `${req.protocol}://${req.get("host")}/`,
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
  console.log(session);
  res.status(200).json({
    status: "success",
    session,
  });
});

module.exports = {
  checkOutSession,
};
