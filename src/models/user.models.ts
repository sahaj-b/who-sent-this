import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
    },
    receivingPaused: {
      type: Boolean,
      require: true,
    },
    emailNotifications: {
      type: Boolean,
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function (next) {
  if (this.passwordHash && this.isModified("passwordHash")) {
    this.passwordHash = await bcrypt.hash(this.passwordHash, 6);
  }
  next();
});

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY } as SignOptions,
  );
};

userSchema.methods.isPasswordCorrect = async function (password: string) {
  return await bcrypt.compare(password, this.passwordHash);
};
export const User = mongoose.model("User", userSchema);
