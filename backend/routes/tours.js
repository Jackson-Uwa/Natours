const express = require("express");
const router = express.Router();
const { protect, restrictTo } = require("../controllers/auth");

const {
  getTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  TopCheapTours,
} = require("../controllers/tours");

//middleware to get cheapest tours
router.get("/top-cheap-tours", protect, TopCheapTours, getTours);

router.get("/", protect, getTours);

router.get("/:id", protect, getTour);

router.post("/", protect, createTour);

router.patch("/:id", protect, updateTour);

router.delete("/:id", protect, restrictTo("admin"), deleteTour);

module.exports = router;
