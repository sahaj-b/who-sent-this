import asyncHandler from "../utils/asyncHandler";
import ApiError from "../utils/ApiError";
import { User } from "../models/user.models";
import ApiResponse from "../utils/ApiResponse";
import { CookieOptions } from "express";
import jwt from "jsonwebtoken";

const loginUser = asyncHandler(async (req, res) => {
  let { email, password } = req.body;
  if (!email) {
    throw new ApiError(401, "Email is required");
  }
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new ApiError(404, "User doesn't exist");
  }
  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid Password");
  }

  //getting access and refresh token
  let accessToken: string;
  try {
    accessToken = user.generateAccessToken();
    user.refreshToken = user.generateRefreshToken();
    await user.save({ validateBeforeSave: false });
  } catch (error) {
    throw new ApiError(
      500,
      "Error while generating and saving access and refresh token",
    );
  }

  const userToReturn = user.toObject();
  userToReturn.passwordHash = undefined;
  userToReturn.refreshToken = undefined;

  const options: CookieOptions = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", user.refreshToken, options)
    .json(new ApiResponse(200, "User Logged in succesfully", userToReturn));
});

const logoutUser = asyncHandler(async (_, res) => {
  const user = res.locals.user;
  if (!user) {
    throw new ApiError(500, "Something went wrong while getting current User");
  }
  user.refreshToken = undefined;
  await user.save({ validateBeforeSave: false });
  const options: CookieOptions = {
    httpOnly: true,
    secure: true,
  };
  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, "User Logged out Succesfully", {}));
});

const changeUserSettings = asyncHandler(async (req, res) => {
  // get name?, receivingPaused?, password?, newPassword? from req
  // validate
  // get user id from cookies
  // check if password == newPassword
  // update in db
  // verify updation
  // return response without password/refreshToken
  let { name, receivingPaused, password, newPassword } = req.body;
  name = name.trim();
});

const registerExistingUserWithEmail = asyncHandler(async (req, res) => {
  // get email, pass from req
  // validate email, pass
  // get user id from cookies
  // update email, pass in db
  // verify updation
  // return response without password/refreshToken
  let { email, password } = req.body;
  email = email.trim();
  User.schema.methods.validateEmail(email);
  User.schema.methods.validatePassword(password);
});

const registerUserAnonymously = asyncHandler(async (req, res) => {
  let { name } = req.body;
  name = name.trim();

  console.log("Registering anonymously: ", name);

  const user = await User.create({
    name: name,
    receivingPaused: false,
  });

  const createdUser = await User.findById(user._id).select("-refreshToken");

  if (!createdUser) {
    throw new ApiError(500, "Internal server error while registering user");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "User anonymously registered succesfully",
        createdUser,
      ),
    );
});

const registerUserWithEmail = asyncHandler(async (req, res) => {
  let { email, password, name } = req.body;
  email = email.trim();
  name = name.trim();

  console.log("Registering with email: ", email);

  User.schema.methods.validateEmail(email);
  User.schema.methods.validatePassword(password);

  const exists = await User.findOne({ email: email });
  if (exists) {
    throw new ApiError(400, "Email already exists");
  }

  const user = await User.create({
    name: name,
    email: email,
    passwordHash: password,
    receivingPaused: false,
  });

  const createdUser = await User.findById(user._id).select(
    "-passwordHash -refreshToken",
  );

  if (!createdUser) {
    throw new ApiError(500, "Internal server error while registering user");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "User registered succesfully", createdUser));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies?.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(401, "No Refresh Token found");
  }
  const decodedToken = jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET!,
  ) as { _id: string };

  const user = await User.findById(decodedToken._id);
  if (!user) {
    throw new ApiError(401, "Invalid Refresh Token");
  }
  if (user.refreshToken !== incomingRefreshToken) {
    throw new ApiError(401, "Refresh Token is Expired");
  }
  user.refreshToken = user.generateRefreshToken();
  const newAccessToken = user.generateAccessToken();
  await user.save();

  const options: CookieOptions = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .cookie("accessToken", newAccessToken, options)
    .cookie("refreshToken", user.refreshToken, options)
    .json(new ApiResponse(200, "New tokens sent successfuly", {}));
});

export {
  changeUserSettings,
  registerExistingUserWithEmail,
  registerUserWithEmail,
  registerUserAnonymously,
  loginUser,
  logoutUser,
  refreshAccessToken,
};
