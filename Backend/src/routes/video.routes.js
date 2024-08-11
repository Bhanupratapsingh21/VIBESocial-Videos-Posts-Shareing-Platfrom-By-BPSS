import {
    handleuploadvideo,
    handlegetvideosbytimeline,
    handlegetvideoadv,
    handlegetVideoById,
    handlegetvideobytegs,
    handledeleteVideo,
    togglePublishStatus,
    updateVideodetails
} from "../controllers/videos.controller.js";
import { Router } from "express"
import { verifyjwt } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { addedusertoreqdontstopresponse } from "../middlewares/authnotstopreq.middleware..js"

const Videorouter = Router();

Videorouter.post("/addvideo", verifyjwt, upload.fields(
    [
        {
            name: "videofile",
            maxCount: 1
        },
        {
            name: "thumbnail",
            maxCount: 1
        }
    ]
), handleuploadvideo);

Videorouter.patch("/update/videodetails/:id", verifyjwt, upload.fields(
    [
        {
            name: "thumbnail",
            maxCount: 1
        }
    ]
), updateVideodetails);

Videorouter.get("/getvideos", handlegetvideosbytimeline);
Videorouter.get("/getvideosadv", handlegetvideoadv);
Videorouter.get("/getvideo/:id", addedusertoreqdontstopresponse,handlegetVideoById);
Videorouter.post("/getvideobytegs", handlegetvideobytegs);
Videorouter.delete("/deletevideo/:id", verifyjwt, handledeleteVideo)
Videorouter.get("/updateisPublished/:id", verifyjwt, togglePublishStatus);


export default Videorouter