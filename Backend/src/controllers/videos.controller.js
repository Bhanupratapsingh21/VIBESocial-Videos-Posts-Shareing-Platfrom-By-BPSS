import mongoose from "mongoose";
import { asyncHandeler } from "../utils/asynchandeler.js";
import { ApiError } from "../utils/apierror.js";
import { ApiResponse } from "../utils/apiresponse.js";
import { Video } from "../models/Video.model.js";
import { deletefromcloudinary, videodeletefromcloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import verifypostowner from "../utils/checkforpostowner.js";
import { User } from "../models/user.model.js";
import { like } from "../models/like.model.js";
import { Subscription } from "../models/subscription.model.js";

const handleuploadvideo = asyncHandeler(async (req, res) => {
    // get video uploaded at multer surver then 
    // get video uploaded at cloudinary 
    // get thumbnail uploaded at multer then cloudinary 
    // create document of video 
    // get duration from cloudinary 
    // and all set 

    const { tittle, description, isPublished, tegs } = req.body
    if (!tittle || !description || !isPublished) {
        return res
            .status(400)
            .json(new ApiError(400, {}, "All Field Required Atleast Tittle and Descriptions"))
    }


    let videofilelocal;
    if (req.files && Array.isArray(req.files.videofile) && req.files.videofile.length > 0) {
        videofilelocal = req.files.videofile[0]?.path
    }

    let thumbnaillocal;
    if (req.files && Array.isArray(req.files.thumbnail) && req.files.thumbnail.length > 0) {
        thumbnaillocal = req.files.thumbnail[0]?.path
    }

    // console.log(videofile, thumbnail)
    if (!videofilelocal || !thumbnaillocal) {
        return res.status(401).json(new ApiError(401, {}, "Video File And Thumbnail Are Required"))
    }
    try {
        // console.log("done")
        const videofile = await uploadOnCloudinary(videofilelocal);
        const thumbnail = await uploadOnCloudinary(thumbnaillocal);

        if (!videofile || !thumbnail) {
            return res.status(501).json(new ApiError(501, {}, "An Error occurred While Uploading"))
        }

        const UploadedVideo = await Video.create({
            tittle,
            description,
            isPublished,
            tegs,
            videoFile: videofile.url,
            thumbnail: thumbnail.url,
            duration: videofile.duration,
            views: 0,
            owner: req.user._id,
        })

        if (!UploadedVideo) {
            return res
                .status(501)
                .json(new ApiError(501, {}, "internal Server Error"))
        }
        return res
            .status(201)
            .json(new ApiResponse(201, UploadedVideo, "Video Uploaded SuccessFully"));

    } catch (error) {
        console.log(error)
        return res
            .status(501)
            .json(new ApiError(501, {}, "internal Server Error"))
    }
});

const handlegetvideosbytimeline = asyncHandeler(async (req, res) => {

    const { q, limit } = req.query;
    let sortOption = {}
    if (q === "newestfirst") {
        sortOption = { createdAt: -1 };
    } else if (q === "oldestfirst") {
        sortOption = { createdAt: 1 };
    } else {
        return res.status(301).json(new ApiError(301, {}, "Invaild Request"))
    }
    const limitOptions = parseInt(limit) || 10; // limit to send 

    try {
        const videos = await Video.find().sort(sortOption).limit(limitOptions)
        if (!videos) {
            return res.status(501).json(new ApiError(501, {}, "Server And Database Error pls Try Again After Some Months"))
        }
        return res.status(200).json(new ApiResponse(200, videos, `Video Fetched SuccessFully With Sorted by ${q}`))
    } catch (error) {
        console.error('Error fetching Video:', error);
        return res.status(500).json(new ApiError(500, {}, "Internal Server Error Please Try Again"));
    }

});

const handlegetvideoadv = asyncHandeler(async (req, res) => {
    const { q, limit, page } = req.query;
    let sortOption = {};
    if (q === "newestfirst") {
        sortOption = { createdAt: -1 };
    } else if (q === 'oldestfirst') {
        sortOption = { createdAt: 1 };
    }

    const pageNumber = parseInt(page) || 1;
    const limitOptions = parseInt(limit) || 10;
    const skip = (pageNumber - 1) * limitOptions;

    try {
        const aggregationPipeline = [
            { $match: { isPublished: true } }, // Match only published videos
            { $sort: sortOption }, // Sort based on sortOption
            { $skip: skip }, // Pagination: Skip records
            { $limit: limitOptions }, // Pagination: Limit records
            {
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "_id",
                    as: "ownerDetails"
                }
            },
            { $unwind: "$ownerDetails" }, // Unwind to get single owner details
            {
                $project: {
                    _id: 1,
                    videoFile: 1,
                    thumbnail: 1,
                    tittle: 1,
                    description: 1,
                    duration: 1,
                    views: 1,
                    isPublished: 1,
                    tags: 1,
                    owner: 1,
                    ownerusername: "$ownerDetails.username",
                    owneravatar: "$ownerDetails.avatar.url",
                    createdAt: 1,
                    updatedAt: 1
                }
            }
        ];

        const videos = await Video.aggregate(aggregationPipeline);

        // Count the total number of published videos
        const totalVideos = await Video.countDocuments({ isPublished: true });
        const totalPages = Math.ceil(totalVideos / limitOptions);

        return res.status(200).json(new ApiResponse(200, {
            page: pageNumber,
            limit: limitOptions,
            totalPages,
            totalVideos,
            videos
        }, "Latest Videos Fetched Successfully"));
    } catch (error) {
        console.error('Error fetching videos:', error);
        return res.status(500).json(new ApiError(500, {}, "Internal Server Error Please Try Again"));
    }


})
const handlegetVideoById = asyncHandeler(async (req, res) => {
    const _id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(400).json(new ApiError(400, {}, "Invalid video ID format"));
    }

    try {
        // Increment the view count and fetch the updated video
        const video = await Video.findByIdAndUpdate(_id, { $inc: { views: 1 } }, { new: true });

        if (!video) {
            return res.status(404).json(new ApiError(404, {}, "Your Requested Video Not Found"));
        }

        // Count the number of likes for the video
        const LikeCount = await like.countDocuments({ video: _id });
        const totalSubs = await Subscription.countDocuments({ channel: video.owner });

        let likebyuserstate = false; // Default value
        let channelsubscribestate = false;

        if (req.user) {
            // Update the user's watch history
            await User.findByIdAndUpdate(req.user._id, {
                $push: { watchHistory: new mongoose.Types.ObjectId(video._id) }
            }, { new: true });

            const getsubscribedstate = await Subscription.findOne({ subscriber: req.user._id, channel: video.owner });
            channelsubscribestate = !!getsubscribedstate;

            // Check if the user has liked the video
            const getlikebyuserstate = await like.findOne({ video: _id, likedBy: req.user._id });
            likebyuserstate = !!getlikebyuserstate; // Convert to boolean
        }

        // Use aggregation pipeline to get the channel details
        const channelDetails = await User.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(video.owner) } },
            { $project: { _id: 1, username: 1, avatar: 1 } }
        ]);

        if (!channelDetails || channelDetails.length === 0) {
            return res.status(404).json(new ApiError(404, {}, "Channel Not Found"));
        }

        const channel = channelDetails[0];

        // Return the response with the video, like count, user like state, and channel details
        return res.status(200).json(new ApiResponse(200, { video, LikeCount, totalSubs, likebyuserstate, channelsubscribestate, channel }, "Video Fetched Successfully"));

    } catch (error) {
        console.error(error);
        return res.status(500).json(new ApiError(500, {}, "Internal Server Error"));
    }
});

const handlegetvideobytegs = asyncHandeler(async (req, res) => {
    const { tags, thisvideo } = req.body;
    if (!tags) {
        return res.status(401).json(new ApiError(401, {}, "Please provide at least one tag"));
    }
    const tagsArray = tags.split(',').map(tag => tag.trim());

    const { q, limit, page } = req.query;
    let sortOption = {};
    if (q === "newestfirst") {
        sortOption = { createdAt: -1 };
    } else if (q === 'oldestfirst') {
        sortOption = { createdAt: 1 };
    }

    const pageNumber = parseInt(page) || 1;
    const limitOptions = parseInt(limit) || 10;
    const skip = (pageNumber - 1) * limitOptions;

    try {
        const aggregationPipeline = [
            {
                $match: {
                    _id: { $ne: new mongoose.Types.ObjectId(thisvideo) },
                    tegs: {
                        $regex: tagsArray.join('|'),
                        $options: 'i'
                    },
                    isPublished: true
                }
            },
            { $sort: sortOption },
            { $skip: skip },
            { $limit: limitOptions },
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
                    videoFile: 1,
                    thumbnail: 1,
                    tittle: 1,
                    description: 1,
                    duration: 1,
                    views: 1,
                    isPublished: 1,
                    tegs: 1,
                    owner: 1,
                    ownerusername: "$ownerDetails.username",
                    owneravatar: "$ownerDetails.avatar.url",
                    createdAt: 1,
                    updatedAt: 1
                }
            }
        ];

        const videos = await Video.aggregate(aggregationPipeline);

        const totalVideos = await Video.countDocuments({
            _id: { $ne: new mongoose.Types.ObjectId(thisvideo) },
            tags: {
                $regex: tagsArray.join('|'),
                $options: 'i'
            },
            isPublished: true
        });
        const totalPages = Math.ceil(totalVideos / limitOptions);

        return res.status(200).json(new ApiResponse(200, {
            page: pageNumber,
            limit: limitOptions,
            totalPages,
            totalVideos,
            videos
        }, "Videos Fetched Successfully"));
    } catch (error) {
        console.error('Error fetching videos:', error);
        return res.status(500).json(new ApiError(500, {}, "Internal Server Error Please Try Again"));
    }

});

const updateVideodetails = asyncHandeler(async (req, res) => {
    const _id = req.params.id

    //TODO: update video details like title, description, thumbnail

    if (!_id) return res.status(400).json(new ApiError(400, {}, "Please Provide Video ID"))

    const lastversionvideo = await Video.findById(_id);
    if (!lastversionvideo) return res.status(404).json(new ApiError(404, {}, "Your Requested Video Not Founded"));

    // console.log(video.owner)
    // console.log(req.user._id)

    const verifyowner = verifypostowner(lastversionvideo.owner, req.user._id);
    if (!verifyowner) {
        return res.status(401).json(new ApiError(401, {}, "You Are Not The Owner Of This Video"))
    }

    const thumbnailimglocal = req.files?.thumbnail?.[0].path;
    const { tittle, description, tegs } = req.body

    // intialize data 
    const videodata = {
        tittle,
        description,
        tegs
    }
    if (thumbnailimglocal) {
        const uploadnewimage = await uploadOnCloudinary(thumbnailimglocal);

        if (!uploadnewimage) {
            return res.status(500).json(new ApiError(500, {}, "Failed to upload image"));
        }

        if (lastversionvideo && lastversionvideo.thumbnail) {
            const public_id = extractIdfromurl(lastversionvideo.thumbnail)
            await deletefromcloudinary(public_id);
        }

        videodata.thumbnail = uploadnewimage.url

    }

    const updatedvideodata = await Video.findByIdAndUpdate(_id, videodata, { new: true });
    if (!updatedvideodata) {
        return res.status(404).json(new ApiError(404, {}, "Video Not Found & Faild to Update"));
    }
    return res.status(200).json(new ApiResponse(200, updatedvideodata, "Video Edited Successfully And Updated"));

})

const handledeleteVideo = asyncHandeler(async (req, res) => {
    const _id = req.params.id

    const video = await Video.findById(_id);
    if (!video) return res.status(404).json(new ApiError(404, {}, "Your Requested Video Not Founded"));
    // console.log(video.owner)
    // console.log(req.user._id)
    const verifyowner = verifypostowner(video.owner, req.user._id);
    if (!verifyowner) {
        return res.status(401).json(new ApiError(401, {}, "You Are Not The Owner Of This Video"))
    }

    const deletedvideo = await Video.findByIdAndDelete(_id)
    if (!deletedvideo) {
        return res.status(404).json(new ApiResponse(404, {}, "Some Error Occerd While Deleteing Video"));
    }
    const videopublicid = extractIdfromurl(deletedvideo.videoFile)
    const thumbnailpublicid = extractIdfromurl(deletedvideo.thumbnail)
    // console.log(videopublicid)
    // console.log(thumbnailpublicid)
    const videodeletefromcloud = await videodeletefromcloudinary(videopublicid)
    const thumbnaildeletefromcloud = await deletefromcloudinary(thumbnailpublicid)

    // console.log(videodeletefromcloud, thumbnaildeletefromcloud)

    return res.status(200).json(new ApiResponse(200, {}, "Video Deleted SuccssFully"))

})

const togglePublishStatus = asyncHandeler(async (req, res) => {
    const videoId = req.params.id
    if (!videoId) {
        return res.status(401).json(new ApiError(401, {}, "Please Provide Video Id"))
    }

    const video = await Video.findById(videoId)
    if (!video) return res.stauts(404).json(404, {}, "Your Requested Video Not Founded")

    const verifyowner = verifypostowner(video.owner, req.user._id);
    if (!verifyowner) {
        return res.status(401).json(new ApiError(401, {}, "You Are Not The Owner Of This Video"))
    }


    video.isPublished = !video.isPublished // toggle the value
    const response = await video.save();
    if (!response) return res.status(501).json(new ApiError(501, {}, "Failed To Update Status Please try Again"))

    return res.status(201).json(new ApiResponse(201, {}, "Status Set SuccessFully"))

})

const extractIdfromurl = (url) => {
    const regex = /\/([^\/]+)\.[a-zA-Z0-9]+$/;
    const match = url.match(regex);
    return match ? match[1] : null;
};

export {
    handlegetvideosbytimeline,
    handleuploadvideo,
    handlegetvideoadv,
    handlegetVideoById,
    handlegetvideobytegs,
    updateVideodetails,
    handledeleteVideo,
    togglePublishStatus
}