import mongoose from "mongoose"
import { Video } from "../models/Video.model.js"
import { Tweet } from "../models/tweets.model.js";
import { Subscription } from "../models/subscription.model.js"
import { like } from "../models/like.model.js"
import { ApiError } from "../utils/apierror.js"
import { ApiResponse } from "../utils/apiresponse.js"
import { asyncHandeler } from "../utils/asynchandeler.js"

const getChannelStats = asyncHandeler(async (req, res) => {
    const { channelId } = req.params;

    if (!channelId) {
        return res.status(400).json(new ApiError(400, {}, "Please Provide Channel ID"));
    }

    try {
        // Count the number of subscribers
        const totalSubscribers = await Subscription.countDocuments({ channel: new mongoose.Types.ObjectId(channelId) });

        // Aggregate total views, total likes, and count total videos
        const videoStats = await Video.aggregate([
            { $match: { owner: new mongoose.Types.ObjectId(channelId) } },
            {
                $group: {
                    _id: null,
                    totalViews: { $sum: "$views" },
                    totalLikes: { $sum: "$likes" },
                    totalVideos: { $sum: 1 }
                }
            }
        ]);

        const stats = videoStats[0] || { totalViews: 0, totalLikes: 0, totalVideos: 0 };

        return res.status(200).json(new ApiResponse(200, {
            totalSubscribers,
            totalViews: stats.totalViews,
            totalLikes: stats.totalLikes,
            totalVideos: stats.totalVideos
        }, "Channel Stats Fetched Successfully"));

    } catch (error) {
        console.error('Error fetching channel stats:', error);
        return res.status(500).json(new ApiError(500, {}, "Internal Server Error Please Try Again"));
    }
});


const getChannelVideos = asyncHandeler(async (req, res) => {

    const { channelId } = req.params;
    const { limit, page } = req.query;

    if (!channelId) {
        return res.status(400).json(new ApiError(400, {}, "Please Provide Channel ID"));
    }

    const pageNumber = parseInt(page) || 1;
    const limitOptions = parseInt(limit) || 10;
    const skip = (pageNumber - 1) * limitOptions;

    try {
        const aggregationPipeline = [
            { $match: { owner: new mongoose.Types.ObjectId(channelId) } }, // Match by channel ID and only published videos
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

        if (!videos.length) {
            return res.status(404).json(new ApiError(404, {}, "No Videos Found"));
        }

        const totalVideos = await Video.countDocuments({ owner: new mongoose.Types.ObjectId(channelId), isPublished: true });
        const totalPages = Math.ceil(totalVideos / limitOptions);

        return res.status(200).json(new ApiResponse(200, {
            page: pageNumber,
            limit: limitOptions,
            totalVideos,
            totalPages,
            videos
        }, "Channel Videos Fetched Successfully"));

    } catch (error) {
        console.error('Error fetching channel videos:', error);
        return res.status(500).json(new ApiError(500, {}, "Internal Server Error Please Try Again"));
    }
});
const getChannelBlogsPublic = asyncHandeler(async (req, res) => {
    const { channelId } = req.params;
    const { limit, page } = req.query;

    if (!channelId) {
        return res.status(400).json(new ApiError(400, {}, "Please Provide Channel ID"));
    }
    if (!mongoose.Types.ObjectId.isValid(channelId)) {
        return res.status(400).json(new ApiError(400, {}, "Invalid video ID format"));
    }

    const pageNumber = parseInt(page) || 1;
    const limitOptions = parseInt(limit) || 10;
    const skip = (pageNumber - 1) * limitOptions;
    const userId = req.user ? new mongoose.Types.ObjectId(req.user._id) : null;

    try {
        const blogs = await Tweet.aggregate([
            { $match: { 'createdBy._id': new mongoose.Types.ObjectId(channelId) } }, // Match by channel ID
            { $skip: skip }, // Pagination: Skip records
            { $limit: limitOptions }, // Pagination: Limit records
            {
                $lookup: {
                    from: 'likes',
                    let: { tweetId: '$_id' },
                    pipeline: [
                        { $match: { $expr: { $eq: ['$tweet', '$$tweetId'] } } },
                        {
                            $group: {
                                _id: null,
                                likeCount: { $sum: 1 },
                                likedByCurrentUser: {
                                    $max: {
                                        $cond: [{ $eq: ['$likedBy', userId] }, true, false]
                                    }
                                }
                            }
                        }
                    ],
                    as: 'likes'
                }
            },
            {
                $addFields: {
                    likeCount: { $ifNull: [{ $arrayElemAt: ['$likes.likeCount', 0] }, 0] },
                    likedByCurrentUser: userId ? { $ifNull: [{ $arrayElemAt: ['$likes.likedByCurrentUser', 0] }, false] } : false
                }
            },
            {
                $lookup: {
                    from: 'subscriptions',
                    let: { ownerId: '$createdBy._id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$channel', '$$ownerId'] },
                                        { $eq: ['$subscriber', userId] }
                                    ]
                                }
                            }
                        },
                        { $project: { _id: 1 } }
                    ],
                    as: 'subscription'
                }
            },
            {
                $addFields: {
                    subscribedByCurrentUser: { $gt: [{ $size: '$subscription' }, 0] }
                }
            },
            { $project: { likes: 0, subscription: 0 } } // Remove the likes and subscription array as they are no longer needed
        ]);

        const totalBlogs = await Tweet.countDocuments({ 'createdBy._id': new mongoose.Types.ObjectId(channelId) });
        const totalPages = Math.ceil(totalBlogs / limitOptions);

        return res.status(200).json(new ApiResponse(200, {
            page: pageNumber,
            limit: limitOptions,
            totalPages,
            totalBlogs,
            blogs
        }, "Channel Blogs Fetched Successfully"));

    } catch (error) {
        console.error('Error fetching channel blogs:', error);
        return res.status(500).json(new ApiError(500, {}, "Internal Server Error Please Try Again"));
    }
});



const getChannelVideospublic = asyncHandeler(async (req, res) => {
    const { channelId } = req.params;
    const { limit, page } = req.query;

    if (!channelId) {
        return res.status(400).json(new ApiError(400, {}, "Please Provide Channel ID"));
    }

    const pageNumber = parseInt(page) || 1;
    const limitOptions = parseInt(limit) || 10;
    const skip = (pageNumber - 1) * limitOptions;

    try {
        const aggregationPipeline = [
            { $match: { owner: new mongoose.Types.ObjectId(channelId), isPublished: true } }, // Match by channel ID and only published videos
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

        if (!videos.length) {
            return res.status(404).json(new ApiError(404, {}, "No Videos Found"));
        }

        const totalVideos = await Video.countDocuments({ owner: new mongoose.Types.ObjectId(channelId), isPublished: true });
        const totalPages = Math.ceil(totalVideos / limitOptions);

        return res.status(200).json(new ApiResponse(200, {
            page: pageNumber,
            limit: limitOptions,
            totalVideos,
            totalPages,
            videos
        }, "Channel Videos Fetched Successfully"));

    } catch (error) {
        console.error('Error fetching channel videos:', error);
        return res.status(500).json(new ApiError(500, {}, "Internal Server Error Please Try Again"));
    }
});


export {
    getChannelStats,
    getChannelVideos,
    getChannelVideospublic,
    getChannelBlogsPublic
}