import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const VideoSchema = new Schema(
    {
        videoFile: {
            cloudinaryUrl: String,
            encodedUrl: {
                type: Map,
                of: String,
                required: true,
            }
        },
        thumbnail: {
            type: String,// clodernary url
            required: true,
        },
        status: {
            type: String,
            enum: ["Processing", "Waiting", "Done"],
            default: "Waiting"
        },
        tittle: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        duration: {
            type: Number, // Video duration
            required: true,
        },
        views: {
            type: Number,
            default: 0
        },
        isPublished: {
            type: Boolean,
            default: true
        },
        tegs: {
            type: String
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true
    }
);

VideoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model("Video", VideoSchema);