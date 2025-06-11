import jwt from "jsonwebtoken";
import UserModel from "../Models/UserModel.js";

export const verify = async (req, res, next) => {
  try {
    const { token } = req.body;

    if (!token) {
        console.error("Access token missing");
        next();
    }
    console.log("Middleware called again")
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

    if (!decodedToken?.id) {
        console.error("Invalid token payload",decodedToken);
      return res.status(401).json({
        status: "failed",
        message: "Invalid token payload",
      });
    }

    const user = await UserModel.findById(decodedToken.id).select("-password -RefreshToken");

    if (!user) {

        console.error("User not found for ID:", user);
      return res.status(404).json({
        status: "failed",
        message: "User not found",
      });
    }

    req.user = user;

    // If you're using this middleware for a protected route, call next()
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
};
