import { ApiError } from "../utils/apierror.js";
import { asyncHandeler } from "../utils/asynchandeler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";

export const addedusertoreqdontstopresponse = asyncHandeler(async (req ,res , next)=>{
    try {
        const token =  req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer"," ")
        let user;

        if(token){
            const decodedToken =  jwt.verify(token , process.env.ACCESS_TOKEN_SECRET)
    
            user = await User.findById(decodedToken?._id).
            select("-password -refreshToken")
            req.user = user;
            // console.log("done")
        }        
        next()
    } catch (error) {
        res.status(401).json(new ApiError(401 ,{} ,"Invaild Req"));
        // throw new ApiError(401,error?.message || "Invaild Access Token")
    }

})