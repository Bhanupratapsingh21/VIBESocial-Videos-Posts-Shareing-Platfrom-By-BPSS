import { Router } from "express";
import {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
} from "../controllers/playlist.controller.js";
import { verifyjwt } from "../middlewares/auth.middleware.js";
const PlaylistRouter = Router();

PlaylistRouter.post("/newplaylist", verifyjwt, createPlaylist);
PlaylistRouter.get("/getuserplaylist/:userId", getUserPlaylists);
PlaylistRouter.get("/getplaylistId/:playlistId", getPlaylistById);
PlaylistRouter.post("/addtoplaylist/:playlistId/:videoId", verifyjwt, addVideoToPlaylist);
PlaylistRouter.post("/removefromplaylist/:playlistId/:videoId", verifyjwt, removeVideoFromPlaylist);
PlaylistRouter.delete("/deleteplaylist/:playlistId", verifyjwt, deletePlaylist);
PlaylistRouter.patch("/updateplaylist/:playlistId", verifyjwt, updatePlaylist);

export default PlaylistRouter