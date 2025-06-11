import mongoose from "mongoose";
import UserModel from "../Models/UserModel.js";
import { hashpassword } from "../Utility/Bcrypt.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../Models/UserModel.js";
import  { OAuth2Client } from 'google-auth-library';


export const googleSignIn = async (req,res)=>{
    const {GoogleToken} = req.body;
    if (!GoogleToken) {
        return res.status(400).json({
            status: "failed",
            message: "Google token is required"
        });
    }
    try{
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        const ticket = await client.verifyIdToken({
    idToken: GoogleToken,
    audience: process.env.GOOGLE_CLIENT_ID, 
  });
    const payload = ticket.getPayload();

        
        //console.log("Decoded Token:", payload.name);
        const existinguser = await UserModel.findOne({ email: payload.email });
        if(existinguser){
            const token = await jwt.sign(
                {id:existinguser._id},process.env.SECRET_KEY, {
                expiresIn: "7d"
            });
            //console.log("User already exists:", token);
            return res.status(200).json({
                status: "success",
                message: "User already exists",
                user: existinguser,
                token: token
            });
        }


        const newuser = await UserModel.create({
            username: payload.name,
            email: payload.email,
            profilephoto: payload.picture,
            Bio: "Text me..."
            ,
            password:"Google Authentication does not require a password"

        });

        return res.status(201).json({
            status: "success",
            message: "User created successfully",
            user: newuser,
            token: await jwt.sign({
                id:newuser._id
            })
        });
    }catch(error){
        console.error("Google Sign In Error:", error);
        return res.status(500).json({
            status: "failed",
            message: "Internal Server Error"
        });
    }
}