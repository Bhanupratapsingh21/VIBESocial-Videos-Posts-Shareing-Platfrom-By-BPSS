import { like } from "../models/like.model.js"
import { User } from "../models/user.model.js"
import { Comment } from "../models/comments.model.js"
import { ApiError } from "../utils/apierror.js"
import { ApiResponse } from "../utils/apiresponse.js"
import { asyncHandeler } from "../utils/asynchandeler.js"
import { Video } from "../models/Video.model.js"
const healthcheck = asyncHandeler(async (req, res) => {
    // console.log("Health Cheack :: GOOD");

    try {
        const totalUser = await User.countDocuments({});
        const totallike = await like.countDocuments({});
        const totalComments = await Comment.countDocuments({});

        // Aggregate total views from all videos
        const totalViewsResult = await Video.aggregate([
            {
                $group: {
                    _id: null,
                    totalViews: { $sum: "$views" }
                }
            }
        ]);

        const totalViews = totalViewsResult.length > 0 ? totalViewsResult[0].totalViews : 0;

        return res.status(200).json(new ApiResponse(200, {
            Stateofwholeapp: {
                totalComments,
                totalUser,
                totallike,
                totalViews
            },
        }, "Health :: All System Is Good And Thanks To Hitesh Sir For This Series #ChaiaurCode"));
    } catch (error) {
        console.error('Error in health check:', error);
        return res.status(500).json(new ApiError(500, {}, "Internal Server Error"));
    }
});

export {
    healthcheck
}