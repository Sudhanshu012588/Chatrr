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
  //////console.log("Login/Verify request received:", req.body);

  const { email, password, token } = req.body;

  // Case 1: Token is provided → verify only
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);

      if (!decoded?.id) {
        return res.status(401).json({
          status: "failed",
          message: "Invalid token payload",
        });
      }

      const user = await UserModel.findById(decoded.id).select("-password -RefreshToken");

      if (!user) {
        return res.status(404).json({
          status: "failed",
          message: "User not found",
        });
      }

      return res.status(200).json({
        status: "verified",
        message: "Token verified",
        User: user,
      });
    } catch (error) {
      console.error("JWT Verify Error:", error);
      return res.status(401).json({
        status: "failed",
        message: "Invalid or expired token",
      });
    }
  }

  // Case 2: Email & Password → normal login
  if (!email || !password) {
    return res.status(400).json({
      status: "failed",
      message: "Please provide email and password",
    });
  }

  try {
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
    ////////console.log("New Access Token:", newAccessToken);
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
  ////////console.log("Access Token:", accessToken);

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



export const getMyID = async (req,res)=>{
  const {AccessToken} = req.body;
  ////////console.log("THis route is called",AccessToken);
  if (!AccessToken) {
    return res.status(401).json({
      status: "unauthorized",
      message: "Access Token is required",
    });
  }
  try {
    const decodedToken = jwt.verify(AccessToken, process.env.SECRET_KEY);
    const userId = decodedToken.id;
    ////////console.log("Decoded User ID:", userId);
    if (!userId) {
      return res.status(401).json({
        status: "unauthorized",
        message: "Invalid Access Token",
      });
    }

    const user = await UserModel.findById(userId).select("-password -RefreshToken");

    if (!user) {
      return res.status(404).json({
        status: "not found",
        message: "User not found",
      });
    }

    let frendreq = [];
    if(user.friendsRequest.length){
      for(let i=0;i<user.friendsRequest.length;i++){
        const friend = await UserModel.findById(user.friendsRequest[i]).select("-password -RefreshToken");
        if(friend){
          frendreq.push(friend);
        }
      }
    }
    return res.status(200).json({
      status: "success",
      message: "User ID fetched successfully",
      Account:user,
      friendRequests: frendreq
    });
  } catch (error) {
    console.error("Get My ID Error:", error);
    return res.status(500).json({
      status: "failed",
      message: "Something went wrong while fetching user ID",
    });
  }
}


export const updateProfile = async (req,res)=>{
  const data = req.body;
  const {AccessToken} = req.body;
  if (!AccessToken) {
    return res.status(401).json({
      status: "unauthorized",
      message: "Access Token is required",
    });
  }

  const bio = data.Bio;
  if(bio){
    try{
      const decodedToken = jwt.verify(AccessToken, process.env.SECRET_KEY);
      const userId = decodedToken.id;
      if (!userId) {
        return res.status(401).json({
          status: "unauthorized",
          message: "Invalid Access Token",
        });
      }
      const user = await UserModel.findById(userId).select("-password -RefreshToken");
      if (!user) {
        return res.status(404).json({
          status: "not found",
          message: "User not found",
        });
      }
      user.Bio = bio;
      await user.save();
      return res.status(200).json({
        status: "success",
        message: "Bio updated successfully",
        User: {
          _id: user._id,
          username: user.username,
          email: user.email,
          profilephoto: user.profilephoto || "",
          Bio: user.Bio
        }
      });
    }catch(error){
      console.error("Error updating bio:", error);
      return res.status(500).json({
        status: "failed",
        message: "Something went wrong while updating bio",
      });
    }
  }

  else if(data.url){
    try{

      const decodedTokenns = jwt.verify(AccessToken, process.env.SECRET_KEY);
      const userId = decodedTokenns.id;
      if (!userId) {
        return res.status(401).json({
          status: "unauthorized",
          message: "Invalid Access Token",
        });
      }
      const user = await UserModel.findById(userId).select("-password -RefreshToken");
      if (!user) {
        return res.status(404).json({
          status: "not found",
          message: "User not found",
        });
      }
      user.profilephoto=data.url;
      await user.save();
      return res.status(200).json({
        status: "success",
        message: "Bio updated successfully",
        User: {
          _id: user._id,
          username: user.username,
          email: user.email,
          profilephoto: user.profilephoto || "",
          Bio: user.Bio
        }
      });
    }catch(error){
      console.error("Error updating bio:", error);
      return res.status(500).json({
        status: "failed",
        message: "Something went wrong while updating bio",
      });
    }
  }
}
