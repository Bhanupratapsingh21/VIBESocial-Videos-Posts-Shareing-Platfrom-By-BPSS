import {Router} from "express";
import { upload } from '../middlewares/multer.middleware.js'

import {
    handleaddblogs,
    getblogsbasic,
    updateeditblogs,
    deleteblogs,
    handlegetindividualblog,
    getblogsAdv
} from "../controllers/tweets.controller.js"

import { verifyjwt } from "../middlewares/auth.middleware.js";
import { addedusertoreqdontstopresponse } from "../middlewares/authnotstopreq.middleware..js";

const TweetsRouter = Router();

TweetsRouter.post("/uploadblog",verifyjwt,upload.fields([{name: "tweetthumbnail", maxCount : 1}]), handleaddblogs );
TweetsRouter.get("/getblogs",getblogsbasic);
TweetsRouter.get("/getblogsadv",addedusertoreqdontstopresponse,getblogsAdv);
TweetsRouter.get("/getblog/:id", handlegetindividualblog);
TweetsRouter.post("/editblogs/:id", verifyjwt,upload.fields([{name: "tweetthumbnail", maxCount : 1}]),updateeditblogs)
TweetsRouter.post("/deleteblog/:id",verifyjwt,deleteblogs);

export default TweetsRouter