import { MESSAGE_COOLDOWN_MS } from "../constants";
import ApiError from "../utils/ApiError";
import asyncHandler from "../utils/asyncHandler";

const messageCooldown = asyncHandler(async (_, res, next) => {
  const user = res.locals.user;
  if (!user) {
    throw new ApiError(400, "Error while getting current user");
  }
  const now = new Date();

  if (user.lastMessageSentAt) {
    const lastMessageTime = new Date(user.lastMessageSentAt);
    const timeDiff = now.getTime() - lastMessageTime.getTime();

    if (timeDiff < MESSAGE_COOLDOWN_MS) {
      const remainingTime = Math.ceil((MESSAGE_COOLDOWN_MS - timeDiff) / 1000);
      throw new ApiError(
        429,
        `Please wait ${remainingTime} seconds before sending another message`,
      );
    }
  }

  user.lastMessageSentAt = now;
  await user.save({ validateBeforeSave: false });

  next();
});

export default messageCooldown;

