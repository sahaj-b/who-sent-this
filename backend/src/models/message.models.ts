import mongoose from "mongoose";
const messageSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },
    sentBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receivedBy: {
      type: String,
      required: true,
      index: true,
    },
    allowReply: {
      type: Boolean,
      required: true,
    },
    repliedToMessageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  { timestamps: { updatedAt: false } },
);

export const Message = mongoose.model("Message", messageSchema);
