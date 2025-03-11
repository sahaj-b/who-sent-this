import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import ApiError from "../utils/ApiError";
import { customAlphabet } from "nanoid";
import { BCRYPT_ROUNDS, PASSWORD_MIN_LENGTH } from "../constants";
const nanoid = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  8,
);

const userSchema = new mongoose.Schema(
  {
    shortId: {
      type: String,
      unique: true,
      index: true,
    },
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
    lastMessageSentAt: {
      type: Date,
      default: null
    },
  },
  {
    timestamps: true,
    methods: {
      validatePassword: function (password: string) {
        if (password.length < PASSWORD_MIN_LENGTH) {
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
    this.passwordHash = await bcrypt.hash(this.passwordHash, BCRYPT_ROUNDS);
  }
  if (!this.shortId) {
    let id;
    let exists = true;
    const UserModel = this.constructor as mongoose.Model<any>;
    do {
      id = nanoid();

      exists = Boolean(await UserModel.exists({ shortId: id }));
    } while (exists);
    this.shortId = id;
  }
  next();
});

export const User = mongoose.model("User", userSchema);
