import jwt from "jsonwebtoken";
import { User } from "../models/user.models";
import ApiError from "../utils/ApiError";
import asyncHandler from "../utils/asyncHandler";

interface JwtPayload {
  _id: string;
}

const verifyJWT = asyncHandler(async (req, res, next) => {
  const accessToken = req.cookies?.accessToken;
  if (!accessToken) {
    throw new ApiError(401, "Unauthorized request");
  }
  const decodedToken = jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET!,
  ) as JwtPayload;

  const user = await User.findById(decodedToken._id);

  if (!user) {
    throw new ApiError(401, "Invalid Acess Token");
  }

  res.locals.user = user;
  next();
});

export default verifyJWT;
