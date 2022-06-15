const express = require("express");
const router = express.Router();

const {
  getUsers,
  getUser,
  signUp,
  logIn,
  verify,
  forgotPassword,
  resetPassword,
  updatePassword,
} = require("../controllers/auth");

const { updateMe, deleteMe } = require("../controllers/user");

router.use(verify);

router.post("/signup", signUp);
router.post("/login", logIn);

router.post("/forgot-password", forgotPassword);
router.patch("/reset-password/:token", resetPassword);
router.patch("/update-my-password", updatePassword);
router.patch("/update-me", updateMe);
router.delete("/delete-me", deleteMe);

router.get("/", getUsers);
router.get("/:id", getUser);

module.exports = router;
