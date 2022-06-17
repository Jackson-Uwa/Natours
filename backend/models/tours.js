const mongoose = require("mongoose");
const User = require("./users");
const slugify = require("slugify");

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      unique: true,
      trim: true,
      maxlength: [40, "A tour name must not be more tha 40 char"],
      minlength: [10, "A tour name must not be less than 10 char"],
    },
    duration: {
      type: Number,
      required: [true, "A tour must have a duration"],
    },
    slug: String,
    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have a group size"],
    },
    difficulty: {
      type: String,
      required: [true, "A tour must have a difficulty"],
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "Difficulty is either: easy, medium, difficult",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      max: [5, "A ratings average must not be more than 5"],
      min: [1, "A ratings average must not be less than 1"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "A tour must have a price"],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          //this only points to current doc on new document creation
          return val < this.price;
        },
        message: "Discount price({VALUE}) should be below regular price",
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, " A tour must have a summary"],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, "A tour must have a cover image"],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: "Point",
          enum: ["Point"],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    reviews: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Review",
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }, 
  }
);

tourSchema.pre("save", async function (next) {
  const guides = this.guides.map(async (id) => await User.findById(id));
  this.guides = await Promise.all(guides);
  next();
});

/*
tourSchema.virtual("reviews", {
  ref: "Review",
  foriegnField: "tour",
  localField: "_id",
});
*/

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: "guides",
    select: "-__v -passwordChangedAt -passwordResetToken -passwordResetExpires",
  });

  this.populate({
    path: "reviews",
    select: "-__v",
  });

  next();
});

// tourSchema.pre(/^find/, function (next) {
//   this.slug = slugify(this.name, { lower: true });
//   next();
// });

module.exports = mongoose.model("Tour", tourSchema);
