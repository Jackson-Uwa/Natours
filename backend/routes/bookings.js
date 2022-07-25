const express = require("express");
const { verify } = require("../controllers/auth");
const {
  checkOutSession,
  createBooking,
  getBookings,
} = require("../controllers/bookings");
// const factory = require("../controllers/factory");
const router = express.Router();

router.get("/checkout-session/:tourID", verify, checkOutSession);
router.get("/", getBookings);
router.post("/", createBooking);
module.exports = router;
