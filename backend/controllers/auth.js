const jwt = require("jsonwebtoken");
const User = require("../models/users");
const AppError = require("../utils/appError");
const asyncHandler = require("../utils/catchAsync");
const Email = require("../utils/email");
const crypto = require("crypto");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);
  // console.log({ jwt: token });
  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  return res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});

const patchUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(201).json({
    status: "success",
    user: user,
  });
});

const getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError(`No user with ID ${req.params.id}`));
  }
  return res.status(200).json({
    status: "success",
    data: user,
  });
});

const signUp = asyncHandler(async (req, res) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  });
  const url = `${req.protocol}://${req.get("host")}/me`;
  console.log(url);
  await new Email(newUser, url).sendWelcome();
  createSendToken(newUser, 201, res);
});

const logIn = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    next(new AppError("Please provide email and password", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  // const correct = await user.correctPassword(password, user.password)
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }
  createSendToken(user, 200, res);
});

const logOut = (req, res) => {
  res.clearCookie("jwt", { httpOnly: true });
  res.status(200).json({ status: "success" });
};

const verify = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token)
    return next(
      new AppError("You are not logged in! Please Log In to get access")
    );
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const currentUser = await User.findById(decoded.id);

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
};

const isLoggedIn = (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      jwt.verify(
        req.cookies.jwt,
        process.env.JWT_SECRET,
        async (err, decoded) => {
          if (err) return res.status(403);
          const currentUser = await User.findById(decoded.id);
          req.user = currentUser;
          res.locals.user = currentUser;
        }
      );
    } catch (err) {
      return next();
    }
  }
  next();
};

const restrictTo = (...roles) => {
  return (req, res, next) => {
    //roles ['admin', 'lead-guide'].role=user
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You don't have permission to perform this action", 403)
      );
    }
    next();
  };
};

const forgotPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("There is no user with email address.", 404));
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  try {
    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/users/resetPassword/${resetToken}`;

    await new Email(user, resetURL).sendReset();

    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError("There was an error sending the email. Try again later!"),
      500
    );
  }
});

const resetPassword = asyncHandler(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  createSendToken(user, 200, res);
});

const updatePassword = asyncHandler(async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.user.id).select("+password");

  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
    return next(new AppError("Your current password is wrong.", 401));
  }

  // 3) If so, update password
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  await user.save();
  // User.findByIdAndUpdate will NOT work as intended!
  createSendToken(user, 200, res);
});

module.exports = {
  getUsers,
  getUser,
  patchUser,
  signUp,
  logIn,
  logOut,
  verify,
  isLoggedIn,
  restrictTo,
  forgotPassword,
  resetPassword,
  updatePassword,
};
