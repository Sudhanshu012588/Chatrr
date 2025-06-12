import UserModel from "../Models/UserModel.js";
import jwt from "jsonwebtoken";
export const friendsRequest = async (req, res) => {
    const { friendID, AccessToken } = req.body;

    if (!AccessToken || !friendID) {
        return res.status(400).json({
            status: "failed",
            message: "Access Token and friendID are required"
        });
    }

    try {
        const decodedToken = jwt.verify(AccessToken, process.env.SECRET_KEY);
        const userId = decodedToken.id;

        const friend = await UserModel.findById(friendID).select("-password -RefreshToken");
        const user = await UserModel.findById(userId).select("-password -RefreshToken");

        if (!friend || !user) {
            return res.status(404).json({
                status: "not found",
                message: "User or Friend not found"
            });
        }

        if (friend.friendsRequest.includes(userId)) {
            return res.status(400).json({
                status: "failed",
                message: "Friend request already sent"
            });
        }

        friend.friendsRequest.push(userId);
        await friend.save();

        return res.status(200).json({
            status: "success",
            message: "Friend request sent successfully"
        });

    } catch (error) {
        console.error("Error sending friend request:", error);
        return res.status(500).json({
            status: "error",
            message: "Something went wrong while sending friend request"
        });
    }
};


export const addFriend = async(req,res)=>{
    const {AccessToken,requestID}=req.body;
    if(!AccessToken || !requestID) {
        console.log("Accepting friend request");
        return res.status(400).json({
            status: "failed",
            message: "Access Token, Request ID and Action are required"
        });
    }
    
        try{
            const decodedToken  = await jwt.verify(AccessToken, process.env.SECRET_KEY);
            if (!decodedToken?.id) {
                return res.status(401).json({
                    status: "unauthorized",
                    message: "Invalid or expired Access Token"
                });
            }
            const userId = decodedToken.id;
            const user = await UserModel.findById(userId).select("-password -RefreshToken");
            const friend = await UserModel.findById(requestID).select("-password -RefreshToken");
            if (!user || !friend) {
                return res.status(404).json({
                    status: "not found",
                    message: "User or Friend not found"
                });
            }
            user.friends.push(requestID);
            user.friendsRequest.pop(requestID);
            friend.friends.push(userId);
            friend.friendsRequest.pop(userId);
            await user.save();
            await friend.save();
            res.status(200).json({
                status: "success",
                message: "Friend request accepted successfully",
                newFriend: {
                    _id: friend._id,
                    username: friend.username,
                    email: friend.email,
                    profilephoto: friend.profilephoto || "",
                }
            });

        }catch(error){
            console.error("Error accepting friend request:", error);
            return res.status(500).json({
                status: "error",
                message: "Something went wrong while accepting friend request"
            });
        }
    
}