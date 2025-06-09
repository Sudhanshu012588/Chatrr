import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      default: "unknown",
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: [true, "Please enter the password"],
    },
    profilephoto: {
      type: String,
    },
    Bio: {
      type: String,
      default: "Text me...",
    },
    RefreshToken: {
      type: String,
      required: false,
    },
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    friendsRequest: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
    collection: "Users",
  }
);

const User = mongoose.model("User", UserSchema);
export default User;
