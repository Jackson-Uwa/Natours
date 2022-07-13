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
  uploadTourImages,
  resizeTourImages,
} = require("../controllers/tours");

router.use(verify);

//middleware to get cheapest tours
router.get("/top-cheap-tours", TopCheapTours, getTours);

router.get("/", getTours);

router.get("/:id", getTour);

router.post("/", createTour);

router.patch(
  "/:id",
  restrictTo("admin"),
  uploadTourImages,
  resizeTourImages,
  updateTour
);

router.delete("/:id", restrictTo("admin"), deleteTour);

module.exports = router;
