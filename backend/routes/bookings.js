const express = require("express");
const { verify } = require("../controllers/auth");
const { checkOutSession } = require("../controllers/bookings");
const router = express.Router();

router.get("/checkout-session/:tourID", verify, checkOutSession);

module.exports = router;
