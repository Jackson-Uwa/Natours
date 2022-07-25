const asyncHandler = require("../utils/catchAsync");

exports.createOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });
