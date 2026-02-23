import mongoose, { Schema, Model, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "User name is required"],
      trim: true,
      minlength: 5,
      maxlength: 50,
    },
    email: {
      type: String,
      required: [true, "User Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Please fill a valid email address"],
    },
    password: {
      type: String,
      required: [true, "User password is required"],
      minlength: 6,
    },
  },
  { timestamps: true },
);

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;
