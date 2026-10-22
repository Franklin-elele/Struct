import mongoose, { Schema, model, Document } from "mongoose";
import { hash } from "bcryptjs";
import { sign, SignOptions } from "jsonwebtoken"; // const {sign} = jwt

interface IUser extends Document {
  timezone: string;
  avatarUrl?: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  refreshToken: string | null;
  generateAccessToken: () => Promise<string>;
  generateRefreshToken: () => Promise<string>;
}

const authModalSchema = new Schema<IUser>(
    // Avatar URL is optional, and it is for displaying user avatars(Images), but firstname, lastname, email, and password are required. Refresh token is optional and can be null.
  {
    avatarUrl: {
      type: String,
      default: null,
    },
    firstname: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
    },
    lastname: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email address"],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    refreshToken: {
      type: String,
      default: null,
    },
    timezone: {
    type: String,
    default: "UTC",
}, 
  },
  { timestamps: true },
);

// ----------Generate auth token method----------

authModalSchema.methods.generateAccessToken = async function () {
  return sign({ id: this._id }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
  });
};

authModalSchema.methods.generateRefreshToken = async function () {
  const refreshToken = sign(
    { id: this._id },
    process.env.REFRESH_TOKEN_SECRET!,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"],
    },
  );
  this.refreshToken = refreshToken;
  await this.save();
  return refreshToken;
};

authModalSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await hash(this.password, 10);
});

const authSchema =
  mongoose.models.User || model<IUser>("User", authModalSchema);

export default authSchema;
