import UserModel from "../Models/UserModel.js";
import jwt from "jsonwebtoken";
export const friendsRequest = async (req, res) => {
    console.log("Access Token is missing"); 
    const {friendID,AccessToken} = req.body;
    if(!AccessToken) {
        return res.status(401).json({
            status: "failed",
            message: "Access Token is required"
        });
    }

    const decodedToken = await jwt.verify(AccessToken, process.env.SECRET_KEY);

    if (!decodedToken?.id) {
        return res.status(401).json({
            status: "unauthorized",
            message: "Invalid or expired Access Token"
        });
    }
    console.log("Decoded Token:", decodedToken);
    const userId = decodedToken.id;
    try {
        const friend = await UserModel.findById(friendID).select("-password -RefreshToken");
        const user = await UserModel.findById(userId).select("-password -RefreshToken");
        if (!friend || !user) {
            return res.status(404).json({
                status: "not found",
                message: "User or Friend not found"
            });
        }
        if (user.friendsRequest.includes(friendID)) {
            return res.status(400).json({
                status: "failed",
                message: "Friend request already sent"
            });
        }
        user.friendsRequest.push(friendID);
        await user.save();
        return res.status(200).json({
            status: "success",
            message: "Friend request sent successfully",
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                profilephoto: user.profilephoto || "",
            },
            friend: {
                _id: friend._id,
                username: friend.username,
                email: friend.email,
                profilephoto: friend.profilephoto || "",
            }

        });
    }
        catch (error) {
        console.error("Error sending friend request:", error);
        return res.status(500).json({
            status: "error",
            message: "Something went wrong while sending friend request"
        });}
}