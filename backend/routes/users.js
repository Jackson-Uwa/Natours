const express = require("express");
const router = express.Router();

const {
  getUsers,
  getUser,
  patchUser,
  signUp,
  logIn,
  logOut,
  verify,
  forgotPassword,
  resetPassword,
  updatePassword,
} = require("../controllers/auth");

const {
  uploadPhoto,
  resizeUserPhoto,
  updateMe,
  deleteMe,
} = require("../controllers/user");

router.post("/login", logIn);
router.post("/signup", signUp);
router.get("/logout", logOut);

router.use(verify);
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password/:token", resetPassword);
router.patch("/update-my-password", updatePassword);
router.patch("/update-me", uploadPhoto, resizeUserPhoto, updateMe);
router.delete("/delete-me", deleteMe);
router.get("/", getUsers);
router.get("/:id", getUser);
router.patch("/:id", patchUser);

module.exports = router;
