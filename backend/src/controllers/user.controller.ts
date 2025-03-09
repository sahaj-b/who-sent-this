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

const getUserInfo = asyncHandler(async (_, res) => {
  const { passwordHash, refreshToken, ...userToReturn } =
    res.locals.user.toObject();
  res
    .status(200)
    .json(new ApiResponse(200, "Sent User info successfuly", userToReturn));
});

const changeUserSettings = asyncHandler(async (req, res) => {
  let { name, receivingPaused, password, newPassword } = req.body;
  name = name?.trim();
  if ([name, receivingPaused, newPassword].every((i) => i === undefined)) {
    throw new ApiError(400, "No settings provided to update");
  }
  if (newPassword && !password) {
    throw new ApiError(400, "Password is required to change password");
  }
  if (newPassword && password === newPassword) {
    throw new ApiError(400, "New password can't be same as old password");
  }
  const user = res.locals.user;
  if (!user) {
    throw new ApiError(500, "Something went wrong while getting current User");
  }
  if (name && name !== user.name) {
    user.name = name;
  }
  if (typeof receivingPaused !== "boolean") {
    throw new ApiError(400, "Invalid receivingPaused field provided");
  } else {
    if (receivingPaused !== user.receivingPaused)
      user.receivingPaused = receivingPaused;
  }
  if (password) {
    if (!(await user.isPasswordCorrect(password))) {
      throw new ApiError(401, "Incorrect Password");
    }
  }
  if (newPassword) {
    User.schema.methods.validatePassword(newPassword);
    user.passwordHash = newPassword;
  }
  await user.save();
  const { passwordHash, refreshToken, ...userToReturn } = user.toObject();
  res
    .status(200)
    .json(
      new ApiResponse(200, "User settings updated succesfully", userToReturn),
    );
});

const addEmailToExistingUser = asyncHandler(async (req, res) => {
  let { email, password } = req.body;
  email = email.trim();
  if (!email) {
    throw new ApiError(400, "Email is required");
  }
  if (!password) {
    throw new ApiError(400, "Password is required");
  }
  User.schema.methods.validateEmail(email);
  User.schema.methods.validatePassword(password);

  if (await User.findOne({ email: email })) {
    throw new ApiError(400, "Email already exists");
  }
  const user = res.locals.user;

  if (!user) {
    throw new ApiError(500, "Something went wrong while getting current user");
  }
  if (user.email) {
    throw new ApiError(400, "User is already registered with email");
  }
  user.email = email;
  user.passwordHash = password;
  await user.save();
  const { passwordHash, refreshToken, ...userToReturn } = user.toObject();
  res
    .status(200)
    .json(
      new ApiResponse(200, "Updated user with email successfuly", userToReturn),
    );
});

const registerAnonymouslyAndLogin = asyncHandler(async (req, res) => {
  let { name } = req.body;
  name = name?.trim();

  const user = await User.create({
    name: name || undefined,
    receivingPaused: true,
  });
  user.refreshToken = user.generateRefreshToken();
  await user.save();

  const createdUser = await User.findById(user._id).select("-refreshToken");

  if (!createdUser) {
    throw new ApiError(500, "Internal server error while registering user");
  }
  const options: CookieOptions = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", user.generateAccessToken(), options)
    .cookie("refreshToken", user.refreshToken, options)
    .json(
      new ApiResponse(
        200,
        "User registered anonymously and logged in succesfully",
        createdUser,
      ),
    );
});

const registerWithEmailAndLogin = asyncHandler(async (req, res) => {
  let { email, password, name } = req.body;
  email = email?.trim();
  name = name?.trim();

  User.schema.methods.validateEmail(email);
  User.schema.methods.validatePassword(password);

  const exists = await User.findOne({ email: email });
  if (exists) {
    throw new ApiError(400, "Email already exists");
  }

  const user = await User.create({
    name: name || undefined,
    email: email,
    passwordHash: password,
    receivingPaused: false,
  });
  user.refreshToken = user.generateRefreshToken();
  await user.save();

  const createdUser = await User.findById(user._id).select(
    "-passwordHash -refreshToken",
  );

  if (!createdUser) {
    throw new ApiError(500, "Internal server error while registering user");
  }

  const options: CookieOptions = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", user.generateAccessToken(), options)
    .cookie("refreshToken", user.refreshToken, options)
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

const deleteUser = asyncHandler(async (req, res) => {
  const incomingPassword = req.body?.password;
  const user = res.locals.user;
  if (!user) {
    throw new ApiError(500, "Something went wrong while getting current User");
  }
  if (user.email && !incomingPassword) {
    throw new ApiError(400, "Password is required to delete account");
  }
  if (user.email && !(await user.isPasswordCorrect(incomingPassword))) {
    throw new ApiError(401, "Incorrect Password");
  }
  await User.findByIdAndDelete(user._id);
  const options: CookieOptions = {
    httpOnly: true,
    secure: true,
  };
  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, "User deleted successfuly", {}));
});

const getUserName = asyncHandler(async (req, res) => {
  const id = req.params.shortId;
  if (!id) throw new ApiError(400, "User ID is required");
  if (typeof id !== "string") throw new ApiError(400, "Invalid User ID");
  const user = await User.findOne({ shortId: id }).select("name -_id");
  if (!user) {
    throw new ApiError(404, "User doesn't exist");
  }
  res.status(200).json(new ApiResponse(200, "Username sent", user));
});

export {
  getUserInfo,
  changeUserSettings,
  addEmailToExistingUser,
  registerWithEmailAndLogin,
  registerAnonymouslyAndLogin,
  loginUser,
  logoutUser,
  refreshAccessToken,
  deleteUser,
  getUserName,
};
