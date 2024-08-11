import { ApiError } from "../utils/apierror.js";
import { asyncHandeler } from "../utils/asynchandeler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";

export const verifyjwt = asyncHandeler(async (req ,res , next)=>{
    try {
        const token =  req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer"," ")
    
        if(!token){
            return res.status(401).json(new ApiError(401 ,{} ,"Unauthorized Req"));
        }
    
        const decodedToken =  jwt.verify(token , process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).
        select("-password -refreshToken")
    
        if(!user){
            // 
           return res.status(401).json(new ApiError(401 ,{} ,"Invaild Access Token"));
           // throw new ApiError(401,"")
        }
    
        req.user = user;
        next()
    } catch (error) {
        res.status(401).json(new ApiError(401 ,{} ,"Invaild Access Token"));
        // throw new ApiError(401,error?.message || "Invaild Access Token")
    }

})