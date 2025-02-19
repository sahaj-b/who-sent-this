import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import ApiError from "../utils/ApiError";

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
      sparse: true,
      // partialFilterExpression: {
      //   email: { $exists: true, $gt: "" },
      // },
    },
    passwordHash: {
      type: String,
    },
    receivingPaused: {
      type: Boolean,
      require: true,
    },
    // emailNotifications: {
    //   type: Boolean,
    //   required: true,
    // },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
    methods: {
      validatePassword: function (password: string) {
        if (password.length < 8) {
          throw new ApiError(
            400,
            "Password must be at least 8 characters long",
          );
        }
        if (password.includes(" ")) {
          throw new ApiError(400, "Password must not include spaces");
        }
      },
      validateEmail: function (email: string) {
        if (email == "") {
          throw new ApiError(400, "Email cannot be empty");
        }
        if (
          !email
            .toLowerCase()
            .match(
              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            )
        ) {
          throw new ApiError(400, "Invalid email");
        }
      },
      isPasswordCorrect: async function (password: string) {
        if (!this.passwordHash) {
          throw new ApiError(500, "Password is not defined for this User");
        }
        return await bcrypt.compare(password, this.passwordHash);
      },

      generateRefreshToken: function () {
        return jwt.sign(
          {
            _id: this._id,
          },
          process.env.REFRESH_TOKEN_SECRET!,
          { expiresIn: process.env.REFRESH_TOKEN_EXPIRY } as SignOptions,
        );
      },
      generateAccessToken: function () {
        return jwt.sign(
          {
            _id: this._id,
          },
          process.env.ACCESS_TOKEN_SECRET!,
          { expiresIn: process.env.ACCESS_TOKEN_EXPIRY } as SignOptions,
        );
      },
    },
  },
);

userSchema.pre("save", async function (next) {
  if (this.passwordHash && this.isModified("passwordHash")) {
    this.passwordHash = await bcrypt.hash(this.passwordHash, 6);
  }
  next();
});

export const User = mongoose.model("User", userSchema);
