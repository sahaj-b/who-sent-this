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
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    repliedToMessageId: String,
  },
  { timestamps: { updatedAt: false } },
);

export const Message = mongoose.model("Message", messageSchema);
