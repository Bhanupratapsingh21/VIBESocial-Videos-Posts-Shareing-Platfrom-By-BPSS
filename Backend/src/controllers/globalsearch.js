import mongoose from "mongoose"
import { ApiError } from "../utils/apierror.js"
import { ApiResponse } from "../utils/apiresponse.js"
import { asyncHandeler } from "../utils/asynchandeler.js"
import { Video } from "../models/Video.model.js"
import { Tweet } from "../models/tweets.model.js"
import { User } from "../models/user.model.js"

const globalsearch = asyncHandeler(async (req, res) => {
    const { s } = req.query;
    const { limit, page } = req.query;

    if (!s) {
        return res.status(301).json(new ApiError(301, {}, "Empty Query"));
    }

    const pageNumber = parseInt(page) || 1;
    const limitOptions = parseInt(limit) || 10;
    const skip = (pageNumber - 1) * limitOptions;

    try {
        // Video Search
        const videoAggregationPipeline = [
            {
                $match: {
                    tittle: {
                        $regex: s,
                        $options: 'i' // Case-insensitive search
                    }
                }
            },
            { $skip: skip },
            { $limit: limitOptions },
            {
                $project: {
                    tittle: 1
                }
            }
        ];
        const videos = await Video.aggregate(videoAggregationPipeline);

        const totalVideosCount = await Video.countDocuments({
            tittle: { $regex: s, $options: 'i' }
        });

        // Tweet Search
        const tweetAggregationPipeline = [
            {
                $match: {
                    content: {
                        $regex: s,
                        $options: 'i' // Case-insensitive search
                    }
                }
            },
            { $skip: skip },
            { $limit: limitOptions },
            {
                $project: {
                    content: 1
                }
            }
        ];
        const tweets = await Tweet.aggregate(tweetAggregationPipeline);

        const totalTweetsCount = await Tweet.countDocuments({
            content: { $regex: s, $options: 'i' }
        });

        // User Search
        const userAggregationPipeline = [
            {
                $match: {
                    $or: [
                        { username: { $regex: s, $options: 'i' } },
                        { fullname: { $regex: s, $options: 'i' } }
                    ]
                }
            },
            { $skip: skip },
            { $limit: limitOptions },
            {
                $project: {
                    username: 1,
                    fullname: 1
                }
            }
        ];
        const users = await User.aggregate(userAggregationPipeline);

        const totalUsersCount = await User.countDocuments({
            $or: [
                { username: { $regex: s, $options: 'i' } },
                { fullname: { $regex: s, $options: 'i' } }
            ]
        });

        // Combine results
        const combinedResults = [
            ...videos.map(v => ({ type: 'video', ...v })),
            ...tweets.map(t => ({ type: 'tweet', ...t })),
            ...users.map(u => ({ type: 'user', ...u }))
        ];

        const totalCount = totalVideosCount + totalTweetsCount + totalUsersCount;
        const totalPages = Math.ceil(totalCount / limitOptions);

        return res.status(200).json(new ApiResponse(200, {
            page: pageNumber,
            limit: limitOptions,
            totalPages,
            totalCount,
            data: combinedResults
        }, "Data fetched successfully"));

    } catch (error) {
        console.error('Error fetching data:', error);
        return res.status(500).json(new ApiError(500, {}, "Internal Server Error Please Try Again"));
    }
});

const getsearchTweets = asyncHandeler(async (req, res) => {
    const { s } = req.query; // Search string
    const { limit, page } = req.query;


    const pageNumber = parseInt(page) || 1;
    const limitOptions = parseInt(limit) || 10;
    const skip = (pageNumber - 1) * limitOptions;
    const userId = req.user ? new mongoose.Types.ObjectId(req.user._id) : null;

    try {
        const aggregationPipeline = [
            {
                $match: {
                    content: {
                        $regex: s,
                        $options: 'i' // Case-insensitive search
                    }
                }
            },
            { $skip: skip },
            { $limit: limitOptions },
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
            { $project: { likes: 0, subscription: 0 } }
        ];

        const tweets = await Tweet.aggregate(aggregationPipeline);

        const totalTweets = await Tweet.countDocuments({
            content: { $regex: s, $options: 'i' }
        });
        const totalPages = Math.ceil(totalTweets / limitOptions);

        return res.status(200).json(new ApiResponse(200, {
            page: pageNumber,
            limit: limitOptions,
            totalPages,
            totalTweets,
            tweets
        }, "Tweets Fetched Successfully"));
    } catch (error) {
        console.error('Error fetching tweets:', error);
        return res.status(500).json(new ApiError(500, {}, "Internal Server Error Please Try Again"));
    }
});

const handlesearchgetvideoadv = asyncHandeler(async (req, res) => {
    const { s, limit, page } = req.query; // Add 's' for search term


    const pageNumber = parseInt(page) || 1;
    const limitOptions = parseInt(limit) || 10;
    const skip = (pageNumber - 1) * limitOptions;

    try {
        const aggregationPipeline = [
            {
                $match: {
                    isPublished: true,
                    tittle: s ? { $regex: s, $options: 'i' } : { $exists: true }
                }
            },
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


        const totalVideos = await Video.countDocuments({
            isPublished: true,
            title: s ? { $regex: s, $options: 'i' } : { $exists: true }
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

const searchUsers = asyncHandeler(async (req, res) => {
    const { s, limit, page } = req.query;
    const pageNumber = parseInt(page) || 1;
    const limitOptions = parseInt(limit) || 10;
    const skip = (pageNumber - 1) * limitOptions;

    if (!s) {
        return res.status(400).json(new ApiError(400, {}, "Search query is required"));
    }

    try {
        const aggregationPipeline = [
            {
                $match: {
                    $or: [
                        { username: { $regex: s, $options: 'i' } },
                        { fullname: { $regex: s, $options: 'i' } }
                    ]
                }
            },
            { $skip: skip },
            { $limit: limitOptions },
            {
                $project: {
                    username: 1,
                    email: 1,
                    fullname: 1,
                    avatar: 1
                }
            }
        ];

        const users = await User.aggregate(aggregationPipeline);

        // Count the total number of users that match the search criteria
        const totalUsers = await User.countDocuments({
            $or: [
                { username: { $regex: s, $options: 'i' } },
                { fullname: { $regex: s, $options: 'i' } }
            ]
        });
        const totalPages = Math.ceil(totalUsers / limitOptions);

        return res.status(200).json(new ApiResponse(200, {
            page: pageNumber,
            limit: limitOptions,
            totalUsers,
            totalPages,
            users
        }, "Users Fetched Successfully"));

    } catch (error) {
        console.error(error);
        return res.status(500).json(new ApiError(500, {}, "Internal Server Error"));
    }
});

export {
    searchUsers,
    globalsearch,
    getsearchTweets,
    handlesearchgetvideoadv
}