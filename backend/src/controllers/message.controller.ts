import { Message } from "../models/message.models";
import { User } from "../models/user.models";
import ApiError from "../utils/ApiError";
import asyncHandler from "../utils/asyncHandler";
import { MAX_MESSAGE_CHARACTERS } from "../constants";
import ApiResponse from "../utils/ApiResponse";
import { Types } from "mongoose";

export const postQuestion = asyncHandler(async (req, res) => {
  const user = res.locals.user;
  if (!user) {
    throw new ApiError(400, "Error while getting current user");
  }
  let { text: question } = req.body;
  question = question?.trim();
  if (!question || typeof question !== "string") {
    throw new ApiError(400, "Invalid Question Text");
  }
  if (question.length > MAX_MESSAGE_CHARACTERS) {
    throw new ApiError(
      400,
      `Question exceeds max character limit (${MAX_MESSAGE_CHARACTERS})`,
    );
  }
  await Message.create({
    sentBy: user._id,
    allowReply: true,
    text: question,
  });

  res
    .status(200)
    .json(new ApiResponse(200, "Question posted successfully", {}));
});

export const sendMessage = asyncHandler(async (req, res) => {
  const user = res.locals.user;
  if (!user) {
    throw new ApiError(400, "Error while getting current user");
  }
  let { recipientId, text, allowReply } = req.body;
  text = text?.trim();
  if (typeof allowReply !== "boolean") {
    throw new ApiError(400, "Invalid allowReply field provided");
  }
  if (!recipientId) {
    throw new ApiError(400, "No recipient ID provided");
  }
  if (!text || typeof text !== "string") {
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
  await Message.create({
    sentBy: user._id,
    receivedBy: recipientId,
    allowReply: allowReply,
    text: text,
  });

  res.status(200).json(new ApiResponse(200, "Message sent Successfully", {}));
});

export const replyToMessage = asyncHandler(async (req, res) => {
  const user = res.locals.user;
  if (!user) {
    throw new ApiError(400, "Error while getting current user");
  }
  let { replyToMsgId, text, allowReply } = req.body;
  text = text?.trim();
  if (typeof allowReply !== "boolean") {
    throw new ApiError(400, "Invalid allowReply field provided");
  }
  if (!replyToMsgId) {
    throw new ApiError(400, "No message ID provided");
  }
  if (!text || typeof text !== "string") {
    throw new ApiError(400, "Invalid message text");
  }
  if (text.length > MAX_MESSAGE_CHARACTERS) {
    throw new ApiError(
      400,
      `Message text exceeds max character limit (${MAX_MESSAGE_CHARACTERS})`,
    );
  }
  if (!Types.ObjectId.isValid(replyToMsgId)) {
    throw new ApiError(400, "Invalid Message ID");
  }
  const message = await Message.findById(replyToMsgId);
  if (!message) {
    throw new ApiError(400, "Invalid Message ID");
  }
  if (message.receivedBy && message.receivedBy !== user.shortId) {
    throw new ApiError(401, "You are not the recipient of this message");
  }
  await Message.create({
    sentBy: user._id,
    receivedBy: message.sentBy,
    repliedToMessageId: replyToMsgId,
    allowReply: allowReply,
    text: text,
  });
  res.status(200).json(new ApiResponse(200, "Reply sent Successfully", {}));
});

export const getMessages = asyncHandler(async (_, res) => {
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

export const deleteMessage = asyncHandler(async (req, res) => {
  const { id } = req.body;
  if (!id) {
    throw new ApiError(400, "No message ID provided");
  }
  const user = res.locals.user;
  if (!user) {
    throw new ApiError(400, "Error while getting current user");
  }
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid message ID provided");
  }
  const message = await Message.findById(id);
  if (!message) {
    throw new ApiError(400, "Invalid message ID provided");
  }
  if (message?.receivedBy !== user.shortId) {
    throw new ApiError(401, "You are not the recipient of this message");
  }
  await Message.findByIdAndDelete(id);
  res
    .status(200)
    .json(new ApiResponse(200, "Message deleted successfully", {}));
});

export const getMessageById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new ApiError(400, "No message ID provided");
  }
  const user = res.locals.user;
  if (!user) {
    throw new ApiError(400, "Error while getting current user");
  }
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(404, "Invalid message ID provided");
  }
  const message = await Message.findById(id).select("-sentBy");
  if (!message) {
    throw new ApiError(404, "Invalid message ID provided");
  }
  if (message.receivedBy && message.receivedBy !== user.shortId) {
    throw new ApiError(401, "You are not the recipient of this message");
  }
  res
    .status(200)
    .json(new ApiResponse(200, "Message fetched successfully", message));
});
