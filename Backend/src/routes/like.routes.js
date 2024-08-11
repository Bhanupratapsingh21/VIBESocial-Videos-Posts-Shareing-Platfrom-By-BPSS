import { 
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
} from "../controllers/like.controller.js";
import { Router } from "express";
import { verifyjwt } from "../middlewares/auth.middleware.js";

const LikeRouter = Router()

LikeRouter.get("/video/:videoId", verifyjwt,toggleVideoLike);
LikeRouter.get("/comment/:commentId", verifyjwt,toggleCommentLike);
LikeRouter.get("/tweet/:tweetId", verifyjwt,toggleTweetLike);

export default LikeRouter