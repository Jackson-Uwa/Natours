const express = require("express");
const router = express.Router();
const { verify, restrictTo } = require("../controllers/auth");

const {
  getTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  TopCheapTours,
} = require("../controllers/tours");

router.use(verify);

//middleware to get cheapest tours
router.get("/top-cheap-tours", TopCheapTours, getTours);

router.get("/", getTours);

router.get("/:id", getTour);

router.post("/", createTour);

router.patch("/:id", updateTour);

router.delete("/:id", deleteTour);

module.exports = router;
