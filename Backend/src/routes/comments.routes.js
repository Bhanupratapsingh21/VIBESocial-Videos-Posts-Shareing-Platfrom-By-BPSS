import { Router } from "express"
import { 
    getPostComments,
    addComment,
    updateComment,
    deleteComment
} from "../controllers/comment.controller.js"
import { verifyjwt } from "../middlewares/auth.middleware.js";
import { addedusertoreqdontstopresponse } from "../middlewares/authnotstopreq.middleware..js";

const CommentRouter = Router();

CommentRouter.post("/postcomment/:type/:postId",verifyjwt,addComment);
CommentRouter.patch("/updatecomment/:commentId" , verifyjwt,updateComment);
CommentRouter.delete("/deletecomment/:commentId" , verifyjwt,deleteComment);
CommentRouter.get("/getcomments/:postId", addedusertoreqdontstopresponse ,getPostComments)

export default CommentRouter