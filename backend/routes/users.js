const express = require("express");
const router = express.Router();

const {
  getUsers,
  getUser,
  signUp,
  logIn,
  protect,
  forgotPassword,
  resetPassword,
  updatePassword,
} = require("../controllers/auth");

const { updateMe, deleteMe } = require("../controllers/user");

router.post("/signup", protect, signUp);
router.post("/login", protect, logIn);

router.post("/forgot-password", protect, forgotPassword);
router.patch("/reset-password/:token", protect, resetPassword);
router.patch("/update-my-password", protect, updatePassword);
router.patch("/update-me", protect, updateMe);
router.delete("/delete-me", protect, deleteMe);

router.get("/", protect, getUsers);
router.get("/:id", protect, getUser);

module.exports = router;
