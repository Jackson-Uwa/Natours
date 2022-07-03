const express = require("express");
const router = express.Router();

const {
  login,
  signup,
  overview,
  tourDetail,
  base,
  userAccount,
} = require("../controllers/view");
const { isLoggedIn, verify } = require("../controllers/auth");

router.get("/login", login);
router.get("/signup", signup);
router.get("/base", isLoggedIn, base);
router.get("/", isLoggedIn, overview);
router.get("/tour/:id", isLoggedIn, tourDetail);
router.get("/me", verify, userAccount);

module.exports = router;
