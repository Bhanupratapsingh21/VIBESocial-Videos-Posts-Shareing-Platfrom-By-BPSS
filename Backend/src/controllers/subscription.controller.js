import mongoose from "mongoose"
import { User } from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import { ApiError } from "../utils/apierror.js"
import { ApiResponse } from "../utils/apiresponse.js"
import { asyncHandeler } from "../utils/asynchandeler.js"


const toggleSubscription = asyncHandeler(async (req, res) => {
    const channelId = req.params.channelId;

    if (!channelId) {
        return res.status(400).json(new ApiError(400, {}, "Please Provide a channel ID"));
    }

    try {
        const channel = await User.findById(channelId);
        if (!channel) {
            return res.status(404).json(new ApiError(404, {}, "Channel not found"));
        }

        const subscription = await Subscription.findOne({ subscriber: req.user._id, channel: channelId });

        if (subscription) {
            const unsubscribe = await Subscription.findByIdAndDelete(subscription._id);
            if (!unsubscribe) {
                return res.status(500).json(new ApiError(500, {}, "Error while unsubscribing from the channel, please try again"));
            }
            return res.status(200).json(new ApiResponse(200, {}, "Unsubscribed successfully"));
        } else {
            const subscribe = await Subscription.create({
                subscriber: req.user._id,
                channel: channelId
            });
            if (!subscribe) {
                return res.status(500).json(new ApiError(500, {}, "Error while subscribing to the channel, please try again"));
            }
            return res.status(200).json(new ApiResponse(200, {}, "Subscribed successfully"));
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json(new ApiError(500, {}, "Internal server error, please try again"));
    }
});


// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandeler(async (req, res) => {
    const { channelId } = req.params;
    const { limit, page } = req.query;

    if (!channelId) {
        return res.status(401).json(new ApiError(401, {}, "Please Provide Channel ID"));
    }

    const pageNumber = parseInt(page) || 1;
    const limitOptions = parseInt(limit) || 10;
    const skip = (pageNumber - 1) * limitOptions;

    try {
        const aggregationPipeline = [
            { $match: { channel: new mongoose.Types.ObjectId(channelId) } },
            { $skip: skip },
            { $limit: limitOptions },
            {
                $lookup: {
                    from: "users",
                    localField: "subscriber",
                    foreignField: "_id",
                    as: "SubscriberDetails"
                }
            },
            { $unwind: "$SubscriberDetails" },
            {
                $project: {
                    "SubscriberDetails.username": 1,
                    "SubscriberDetails.email": 1,
                    "SubscriberDetails.fullname": 1,
                    "SubscriberDetails.avatar": 1,
                }
            }
        ];

        const subscribers = await Subscription.aggregate(aggregationPipeline);
        if (!subscribers.length) {
            return res.status(404).json(new ApiError(404, {}, "0 Subscribers"));
        }

        const totalSubs = await Subscription.countDocuments({ channel: new mongoose.Types.ObjectId(channelId) });
        const totalPages = Math.ceil(totalSubs / limitOptions);

        return res.status(200).json(new ApiResponse(200, {
            page: pageNumber,
            limit: limitOptions,
            totalSubs,
            totalPages,
            subscribers,
        }, "Subscribers Fetched Successfully"));

    } catch (error) {
        console.log(error);
        return res.status(501).json(new ApiError(501, {}, "Internal Server Error"));
    }
});



// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandeler(async (req, res) => {
    const { subscriberId } = req.params
    const { limit, page } = req.query;

    if (!subscriberId) {
        return res.status(401).json(new ApiError(401, {}, "Please Login"));
    }

    const pageNumber = parseInt(page) || 1;
    const limitOptions = parseInt(limit) || 10;
    const skip = (pageNumber - 1) * limitOptions;

    try {
        const aggregationPipeline = [
            { $match: { subscriber: new mongoose.Types.ObjectId(subscriberId) } },
            { $skip: skip },
            { $limit: limitOptions },
            {
                $lookup: {
                    from: "users",
                    localField: "channel",
                    foreignField: "_id",
                    as: "ChannelDetails"
                }
            },
            { $unwind: "$ChannelDetails" },
            {
                $project: {
                    "ChannelDetails.username": 1,
                    "ChannelDetails.email": 1,
                    "ChannelDetails.fullname": 1,
                    "ChannelDetails.avatar": 1,
                }
            }
        ];

        const SubscribedChannels = await Subscription.aggregate(aggregationPipeline);
        if (!SubscribedChannels.length) {
            return res.status(404).json(new ApiError(404, {}, "You have't Subscribed To Any One"));
        }

        const totalSubscribedChannels = await Subscription.countDocuments({ subscriber: new mongoose.Types.ObjectId(subscriberId) });
        const totalPages = Math.ceil(totalSubscribedChannels / limitOptions);

        return res.status(200).json(new ApiResponse(200, {
            page: pageNumber,
            limit: limitOptions,
            totalSubscribedChannels,
            totalPages,
            SubscribedChannels,
        }, "Subscribed Channels Fetched Successfully"));

    } catch (error) {
        console.log(error);
        return res.status(501).json(new ApiError(501, {}, "Internal Server Error"));
    }
});

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}