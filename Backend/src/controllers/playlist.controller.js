import mongoose, { isValidObjectId } from "mongoose"
import { Playlist } from "../models/playlist.model.js"
import { ApiError } from "../utils/apierror.js"
import { ApiResponse } from "../utils/apiresponse.js"
import { asyncHandeler } from "../utils/asynchandeler.js"
import verifypostowner from "../utils/checkforpostowner.js"


const createPlaylist = asyncHandeler(async (req, res) => {
    const { name, description } = req.body
    //TODO: create playlist
    if (!name || !description) {
        return res.status(402).json(new ApiError(402, {}, "Please Provide Playlist's Name And Descriptions"))
    }

    const playlist = await Playlist.create({
        name,
        description,
        owner: req.user._id
    });

    if (!playlist) {
        return res.status(501).json(new ApiError(501, {}, "Internal Server Error Pls Try Again"))
    }

    return res.status(201).json(new ApiResponse(201, playlist, "Playlist Created Successfully Add Video In It"))
})
const getUserPlaylists = asyncHandeler(async (req, res) => {
    const { userId } = req.params;
    try {
        // Find playlists where the creator matches the userId
        const playlists = await Playlist.find({ owner: userId });

        if (!playlists.length) {
            return res.status(404).json(new ApiError(404, {}, "No playlists found for the user"));
        }

        return res.status(200).json(new ApiResponse(200, playlists, "User's Playlists Fetched Successfully"));
    } catch (error) {
        console.error('Error fetching user playlists:', error);
        return res.status(500).json(new ApiError(500, {}, "Internal Server Error Please Try Again"));
    }
});

const getPlaylistById = asyncHandeler(async (req, res) => {
    const { playlistId } = req.params;
    const { limit, page } = req.query;
    // console.log(limit, page)
    const pageNumber = parseInt(page) || 1;
    const limitOptions = parseInt(limit) || 10;
    const skip = (pageNumber - 1) * limitOptions;

    try {
        const aggregationPipeline = [
            { $match: { _id: new mongoose.Types.ObjectId(playlistId) } },
            {
                $lookup: {
                    from: "videos",
                    localField: "videos",
                    foreignField: "_id",
                    as: "videoDetails"
                },
            },
            {
                $addFields: {
                    videos: {
                        $slice: ["$videos", skip, limitOptions]
                    }
                }
            },
            { $unwind: "$videoDetails" }, // If necessary
            {
                $lookup: {
                    from: "users",
                    localField: "videoDetails.owner",
                    foreignField: "_id",
                    as: "videoOwnerDetails"
                }
            },
            { $unwind: "$videoOwnerDetails" },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    description: 1,
                    owner: 1,
                    videos: {
                        _id: "$videoDetails._id",
                        videoFile: "$videoDetails.videoFile",
                        thumbnail: "$videoDetails.thumbnail",
                        tittle: "$videoDetails.tittle",
                        description: "$videoDetails.description",
                        duration: "$videoDetails.duration",
                        views: "$videoDetails.views",
                        isPublished: "$videoDetails.isPublished",
                        tags: "$videoDetails.tags",
                        owner: "$videoOwnerDetails._id",
                        ownerusername: "$videoOwnerDetails.username",
                        owneravatar: "$videoOwnerDetails.avatar.url",
                        createdAt: "$videoDetails.createdAt",
                        updatedAt: "$videoDetails.updatedAt"
                    }
                }
            },
            {
                $group: {
                    _id: "$_id",
                    name: { $first: "$name" },
                    description: { $first: "$description" },
                    owner: { $first: "$owner" },
                    videos: { $push: "$videos" }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "_id",
                    as: "ownerDetails"
                }
            },
            { $unwind: "$ownerDetails" },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    description: 1,
                    owner: 1,
                    videos: 1,
                    "ownerDetails.username": 1,
                    "ownerDetails.email": 1,
                    "ownerDetails.fullname": 1,
                    "ownerDetails.avatar": "$ownerDetails.avatar",
                }
            },
        ];
        // Ensure Playlists structure and verify pagination logic

        const Playlists = await Playlist.aggregate(aggregationPipeline);

        if (!Playlists || Playlists.length === 0) {
            return res.status(404).json(new ApiError(404, {}, "Not Found"));
        }
        const TotalVideoinPlaylist = Playlists[0].videos[0].length;
        const totalPages = Math.ceil(TotalVideoinPlaylist / limitOptions);
        // console.log(Playlists[0].videos[0].length)
        return res.status(200).json(new ApiResponse(200, {
            page: pageNumber,
            limit: limitOptions,
            totalPages,
            TotalVideoinPlaylist,
            Playlists
        }, "Playlists and Videos Fetched Successfully"));
    } catch (error) {
        console.error('Error fetching Playlists:', error);
        return res.status(500).json(new ApiError(500, {}, "Internal Server Error Please Try Again"));
    }

})

const addVideoToPlaylist = asyncHandeler(async (req, res) => {
    const { playlistId, videoId } = req.params
    if (!playlistId || !videoId) {
        return res.status(402).json(new ApiError(402, {}, "Please Provide Playlist ID And Video ID"))
    }

    const playlist = await Playlist.findById(playlistId)
    if (!playlist) {
        return res.status(404).json(new ApiError(404, {}, "Playlist Not Found"));
    }

    const verifyowner = verifypostowner(playlist.owner, req.user._id);
    if (!verifyowner) {
        return res.status(401).json(new ApiError(401, {}, "Your Are Not The Owner Of this Playlist"));
    }

    const addvideo = await Playlist.findByIdAndUpdate(playlistId, {
        $push: { videos: videoId }
    }, { new: true });

    if (!addvideo) {
        return res.status(501).json(new ApiError(501, {}, "Faild To Add Video In Playlist Pls Try Again Leter"))
    }

    return res.status(201).json(new ApiResponse(201, addvideo, "Video Add To Playlist SuccessFully"))

    // aggregate will added here 
})

const removeVideoFromPlaylist = asyncHandeler(async (req, res) => {
    const { playlistId, videoId } = req.params;
    if (!playlistId || !videoId) {
        return res.status(402).json(new ApiError(402, {}, "Please Provide Playlist ID And Video ID"));
    }

    try {
        const playlist = await Playlist.findById(playlistId);
        if (!playlist) {
            return res.status(404).json(new ApiError(404, {}, "Playlist Not Found"));
        }

        const verifyowner = verifypostowner(playlist.owner, req.user._id);
        if (!verifyowner) {
            return res.status(401).json(new ApiError(401, {}, "You Are Not The Owner Of This Playlist"));
        }

        // console.log(`Original playlist videos: ${playlist.videos}`);

        playlist.videos = playlist.videos.filter(videoid => videoid.toString() !== videoId.toString());

        // console.log(`Updated playlist videos: ${playlist.videos}`);

        await playlist.save();

        return res.status(200).json(new ApiResponse(200, {}, "Video Deleted From Playlist Successfully"));
    } catch (error) {
        console.error(error);
        return res.status(500).json(new ApiError(500, {}, "Internal Server Error, Please Try Again"));
    }

})

const deletePlaylist = asyncHandeler(async (req, res) => {
    const { playlistId } = req.params
    if (!playlistId) {
        return res.status(402).json(new ApiError(402, {}, "Please Provide Playlist ID"))
    }
    const playlist = await Playlist.findById(playlistId)
    if (!playlist) {
        return res.status(404).json(new ApiError(404, {}, "Playlist Not Found"));
    }

    const verifyowner = verifypostowner(playlist.owner, req.user._id);
    if (!verifyowner) {
        return res.status(401).json(new ApiError(401, {}, "Your Are Not The Owner Of this Playlist"));
    }
    const deletePlaylist = await Playlist.findByIdAndDelete(playlist);
    if (!deletePlaylist) {
        return res.status(501).json(new ApiError(501, {}, "Error While Deleteing Playlist Pls Try Again"));
    }
    return res.status(200).json(new ApiResponse(200, {}, "Playlist Deleted SuccessFully"))


})

const updatePlaylist = asyncHandeler(async (req, res) => {
    const { playlistId } = req.params;
    const { name, description } = req.body;

    if (!name || !description) {
        return res.status(402).json(new ApiError(402, {}, "Please Provide Playlist's Name And Description"));
    }

    try {
        const playlist = await Playlist.findById(playlistId);
        if (!playlist) {
            return res.status(404).json(new ApiError(404, {}, "Playlist Not Found"));
        }

        const verifyowner = verifypostowner(playlist.owner, req.user._id);
        if (!verifyowner) {
            return res.status(401).json(new ApiError(401, {}, "You Are Not The Owner Of This Playlist"));
        }

        const updatedPlaylist = await Playlist.findByIdAndUpdate(playlistId, {
            name: name,
            description: description
        }, { new: true });

        if (!updatedPlaylist) {
            return res.status(500).json(new ApiError(500, {}, "Error While Updating Playlist"));
        }

        return res.status(200).json(new ApiResponse(200, updatedPlaylist, "Playlist Updated Successfully"));
    } catch (error) {
        console.error(error);
        return res.status(500).json(new ApiError(500, {}, "Internal Server Error, Please Try Again"));
    }

})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}