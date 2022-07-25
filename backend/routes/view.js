const express = require("express");
const router = express.Router();
const { bookingCheckout } = require("../controllers/bookings");

const {
  login,
  signup,
  overview,
  tourDetail,
  base,
  userAccount,
  myTours,
} = require("../controllers/view");
const { isLoggedIn, verify } = require("../controllers/auth");

router.get("/login", login);
router.get("/signup", signup);
router.get("/base", isLoggedIn, base);
router.get("/", bookingCheckout, isLoggedIn, overview);
router.get("/tour/:id", isLoggedIn, tourDetail);
router.get("/me", verify, userAccount);
router.get("/my-tours", verify, myTours);

module.exports = router;
