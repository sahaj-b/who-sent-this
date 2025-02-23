import { Message } from "../models/message.models";
import { User } from "../models/user.models";
import ApiError from "../utils/ApiError";
import asyncHandler from "../utils/asyncHandler";
import { MAX_MESSAGE_CHARACTERS } from "../constants";
import ApiResponse from "../utils/ApiResponse";
import { Types } from "mongoose";

const sendMessage = asyncHandler(async (req, res) => {
  const user = res.locals.user;
  if (!user) {
    throw new ApiError(400, "Error while getting current user");
  }
  let { recipientId, text, replyToMsgId, allowReply } = req.body;
  text = text?.trim();
  if (!allowReply || typeof allowReply !== "boolean") {
    allowReply = replyToMsgId ? false : true;
  }
  if (!recipientId) {
    throw new ApiError(400, "No recipient ID provided");
  }
  if (!text || typeof text !== "string") {
    console.log(text);
    throw new ApiError(400, "Invalid message text");
  }
  if (text.length > MAX_MESSAGE_CHARACTERS) {
    throw new ApiError(
      400,
      `Message text exceeds max character limit (${MAX_MESSAGE_CHARACTERS})`,
    );
  }
  const recepient = await User.findOne({ shortId: recipientId });
  if (!recepient) {
    throw new ApiError(400, "Invalid Recipient ID");
  }
  if (replyToMsgId && allowReply) {
    throw new ApiError(
      400,
      "Reply messages are not allowed to have allowReply set to true",
    );
  }
  if (replyToMsgId && !Types.ObjectId.isValid(replyToMsgId)) {
    throw new ApiError(400, "Invalid message ID provided for reply");
  }
  if (replyToMsgId && !(await Message.findById(replyToMsgId))) {
    throw new ApiError(
      400,
      "Cannot reply to an non-existing or deleted message",
    );
  }
  await Message.create({
    sentBy: user._id,
    receivedBy: recipientId,
    allowReply: allowReply,
    repliedToMessageId: replyToMsgId ?? undefined,
    text: text,
  });

  res.status(200).json(new ApiResponse(200, "Message sent Successfully", {}));
});
const getMessages = asyncHandler(async (_, res) => {
  const user = res.locals.user;
  if (!user) {
    throw new ApiError(400, "Error while getting current user");
  }
  const messageList = await Message.find({ receivedBy: user.shortId }).select(
    "-sentBy",
  );
  res
    .status(200)
    .json(new ApiResponse(200, "Messages fetched successfully", messageList));
});

export { sendMessage, getMessages };
