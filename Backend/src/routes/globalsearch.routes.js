import { Router } from "express";
import {
    searchUsers,
    globalsearch,
    getsearchTweets,
    handlesearchgetvideoadv
} from '../controllers/globalsearch.js'
import { addedusertoreqdontstopresponse } from "../middlewares/authnotstopreq.middleware..js";

const globalsearchRouter = Router();

globalsearchRouter.get("/", globalsearch);
globalsearchRouter.get("/tweets", addedusertoreqdontstopresponse, getsearchTweets);
globalsearchRouter.get("/videos", handlesearchgetvideoadv);
globalsearchRouter.get("/users", searchUsers);

export default globalsearchRouter