const Tour = require("../models/tours");
const asyncHandler = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");
const multer = require("multer");
const sharp = require("sharp");

const multerStorage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(
      new AppError("Not an image file, please upload only image files", 400),
      false
    );
  }
};

// upload.single('image') req.file
// upload.array('images', 5) req.files

const upload = multer({
  storage: multerStorage,
  multerFilter: fileFilter,
});

const uploadTourImages = upload.fields([
  { name: "images", maxCount: 3 },
  { name: "imageCover", maxCount: 1 },
]);

const resizeTourImages = asyncHandler(async (req, res, next) => {
  if (!req.files.images || !req.files.imageCover) return next();
  //1 cover image
  req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/tours/${req.body.imageCover}`);

  // 2) Images
  req.body.images = [];

  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/img/tours/${filename}`);

      req.body.images.push(filename);
    })
  );

  next();
});
//middleware to get cheapest tours
const TopCheapTours = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};

const getTours = asyncHandler(async (req, res, next) => {
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .fields()
    .paginate();
  //execute query
  const tours = await features.query;
  return res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      tours,
    },
  });
});

const getTour = asyncHandler(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  if (!tour) {
    return next(new AppError("There is no tour with that ID", 401));
  }
  return res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
});

const createTour = asyncHandler(async (req, res) => {
  const newTour = await Tour.create(req.body);
  return res.status(201).json({
    status: "success",
    data: {
      tour: newTour,
    },
  });
});

const updateTour = asyncHandler(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  return res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
});

const deleteTour = asyncHandler(async (req, res) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);
  return res.status(204).json({
    status: "success",
    data: {
      tour,
    },
  });
});

module.exports = {
  getTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  TopCheapTours,
  uploadTourImages,
  resizeTourImages,
};
