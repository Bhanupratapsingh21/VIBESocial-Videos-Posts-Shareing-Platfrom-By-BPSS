import mongoose, { isValidObjectId } from "mongoose"
import { like } from "../models/like.model.js"
import { ApiError } from "../utils/apierror.js"
import { ApiResponse } from "../utils/apiresponse.js"
import { asyncHandeler } from "../utils/asynchandeler.js"
import { Comment } from "../models/comments.model.js"

const toggleVideoLike = asyncHandeler(async (req, res) => {
    const videoId = req.params.videoId
    try {
        // verify user 
        // verif and create like documnet 
        if (!req.user._id) {
            return res.status(401).json(new ApiError(401, {}, "Please Login First"));
        }

        // if like already exist by same user id and video then dislike it 

        const unlikevideo = await like.findOneAndDelete({ video: videoId, likedBy: req.user._id })
        if (unlikevideo) {
            return res.status(201).json(new ApiResponse(201, {}, "Video unlike SuccussFully"))
        }
        // if like dont exist means add like 
        const Like = await like.create({
            video: videoId,
            likedBy: req.user._id
        })
        if (!Like) {
            return res.status(501).json(new ApiError(501, {}, "Error Whill Addeing Like pls Try Again Leter"))
        }
        res.status(201).json(new ApiResponse(201, { Like }, "Like Added To Video SuccessFully"))
    } catch (error) {
        return res.status(501).json(new ApiError(501, {}, "Internal Server Error Pls Try Again"))
    }

})

const toggleCommentLike = asyncHandeler(async (req, res) => {
    const commentId = req.params.commentId
    try {
        // verify user 
        // verif and create like documnet 
        if (!req.user._id) {
            return res.status(401).json(new ApiError(401, {}, "Please Login First"));
        }

        // if like already exist by same user id and video then dislike it 

        const unlikecomment = await like.findOneAndDelete({ comment: commentId, likedBy: req.user._id })
        if (unlikecomment) {
            return res.status(201).json(new ApiResponse(201, {}, "Commnet unlike SuccussFully"))
        }
        // if like dont exist means add like 
        const Like = await like.create({
            comment: commentId,
            likedBy: req.user._id
        })
        if (!Like) {
            return res.status(501).json(new ApiError(501, {}, "Error Whill Addeing Like pls Try Again Leter"))
        }
        res.status(201).json(new ApiResponse(201, { Like }, "Like Added To Comment SuccessFully"))
    } catch (error) {
        return res.status(501).json(new ApiError(501, {}, "Internal Server Error Pls Try Again"))
    }

})

const toggleTweetLike = asyncHandeler(async (req, res) => {
    
    const tweetId = req.params.tweetId
    try {
        // verify user 
        // verif and create like documnet 
        if (!req.user._id) {
            return res.status(401).json(new ApiError(401, {}, "Please Login First"));
        }

        // if like already exist by same user id and video then dislike it 

        const unliketweet = await like.findOneAndDelete({ tweet: tweetId, likedBy: req.user._id })
        if (unliketweet) {
            return res.status(201).json(new ApiResponse(201, {}, "tweet unlike SuccussFully"))
        }
        // if like dont exist means add like 
        const Like = await like.create({
            tweet: tweetId,
            likedBy: req.user._id
        })
        if (!Like) {
            return res.status(501).json(new ApiError(501, {}, "Error Whill Addeing Like pls Try Again Leter"))
        }
        res.status(201).json(new ApiResponse(201, { Like }, "Like Added To tweet SuccessFully"))
    } catch (error) {
        return res.status(501).json(new ApiError(501, {}, "Internal Server Error Pls Try Again"))
    }
}
)

const getLikedVideos = asyncHandeler(async (req, res) => {
    //TODO: get all liked videos
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}