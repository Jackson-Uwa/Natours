const express = require("express");
const router = express.Router();
const { verify } = require("../controllers/auth");
// const Review = require("../models/review");

const reviewController = require("../controllers/review");

// router.use(verify);
router.get("/", reviewController.getReviews);
router.get("/:id", reviewController.getReview);
router.post("/", reviewController.addReview);
router.patch("/:id", reviewController.patchReview);

module.exports = router;
