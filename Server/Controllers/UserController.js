import mongoose from "mongoose";
import UserModel from "../Models/UserModel.js";
import { hashpassword } from "../Utility/Bcrypt.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../Models/UserModel.js";

// Generate JWT Token
const generateToken = (userId, expiresIn) => {
  return jwt.sign({ id: userId }, process.env.SECRET_KEY, {
    expiresIn,
  });
};

// ✅ Register Controller
export const register = async (req, res) => {
  try {
    const { username, email, password, profilepicture } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        status: "failed",
        message: "Please fill all the required fields",
      });
    }

    const existedUser = await UserModel.findOne({
      $or: [{ username }, { email }],
    });

    if (existedUser) {
      return res.status(409).json({
        status: "failed",
        message: "User with email or username already exists",
      });
    }

    const hashedPassword = await hashpassword(password);

    const createdUser = await UserModel.create({
      username,
      email,
      password: hashedPassword,
      profilephoto: profilepicture || "",
    });

    const RefreshToken = generateToken(createdUser._id, "7d");
    const AccessToken = generateToken(createdUser._id, "4h");

    createdUser.RefreshToken = RefreshToken;
    await createdUser.save();

    return res.status(201).json({
      status: "success",
      message: "Registered Successfully",
      AccessToken,
      RefreshToken,
    });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({
      status: "failed",
      message: "Something went wrong during registration",
    });
  }
};

// ✅ Login Controller
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "failed",
        message: "Please provide email and password",
      });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(401).json({
        status: "failed",
        message: "Email not registered",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        status: "unauthorized",
        message: "Invalid credentials",
      });
    }

    const AccessToken = generateToken(user._id, "4h");
    const RefreshToken = generateToken(user._id, "7d");

    user.RefreshToken = RefreshToken;
    await user.save();

    const safeUser = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profilephoto: user.profilephoto || "",
    };

    return res.status(200).json({
      status: "verified",
      message: "Login successful",
      AccessToken,
      RefreshToken,
      User: safeUser,
    });

  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      status: "failed",
      message: "Something went wrong during login",
    });
  }
};

// ✅ Refresh Token Verification
export const verifyRefreshtoken = async (req, res) => {
  try {
    const { RefreshToken } = req.body;

    if (!RefreshToken) {
      return res.status(400).json({
        status: "failed",
        message: "RefreshToken is required",
      });
    }

    const decodedToken = jwt.verify(RefreshToken, process.env.SECRET_KEY);

    if (!decodedToken?.id) {
      return res.status(401).json({
        status: "unauthorized",
        message: "Invalid or expired RefreshToken",
      });
    }

    const user = await UserModel.findById(decodedToken.id).select("-password -RefreshToken");

    if (!user) {
      return res.status(401).json({
        status: "unauthorized",
        message: "User not found",
      });
    }

    const newAccessToken = generateToken(user._id, "4h");
    const newRefreshToken = generateToken(user._id, "7d");

    await UserModel.findByIdAndUpdate(user._id, { RefreshToken: newRefreshToken });
    console.log("New Access Token:", newAccessToken);
    return res.status(200).json({
      status: "authorized",
      message: "Token refreshed",
      AccessToken: newAccessToken,
      RefreshToken: newRefreshToken,
      User: user,
    });

  } catch (error) {
    console.error("Refresh Token Error:", error);
    return res.status(500).json({
      status: "failed",
      message: error.message || "Something went wrong during refresh",
    });
  }
};



export const getUser = async (req, res) => {
  const accessToken = req.headers.accesstoken;
  console.log("Access Token:", accessToken);

  if (!accessToken) {
    return res.status(401).json({
      status: "unauthorized",
      message: "Access Token is required",
    });
  }

  try {
    const decodedToken = jwt.verify(accessToken, process.env.SECRET_KEY);
    const userId = decodedToken.id;

    // Find the current user to access friends/friendRequests
    const currentUser = await UserModel.findById(userId).select("friends friendsRequest");
    if (!currentUser) {
      return res.status(404).json({
        status: "not found",
        message: "Current user not found",
      });
    }

    const excludedIDs = [
      ...currentUser.friends.map(id => id.toString()),
      ...currentUser.friendsRequest.map(id => id.toString()),
      userId.toString(), // exclude self
    ];

    // Fetch users that are NOT in the above lists
    const users = await UserModel.find({
      _id: { $nin: excludedIDs },
    }).select("-password -RefreshToken");

    if (!users || users.length === 0) {
      return res.status(404).json({
        status: "not found",
        message: "No eligible users found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Eligible users fetched successfully",
      users,
    });
  } catch (error) {
    console.error("Get User Error:", error);
    return res.status(500).json({
      status: "failed",
      message: "Something went wrong while fetching user data",
    });
  }
};