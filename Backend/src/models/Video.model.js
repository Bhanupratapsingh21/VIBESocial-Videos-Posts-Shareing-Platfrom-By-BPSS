import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";


const VideoSchema = new Schema(
    {
        videoFile: {
            type: String,// clodernary url
            required: true,
        },
        thumbnail: {
            type: String,// clodernary url
            required: true,
        },
        tittle: {
            type: String,
            required: true,
        },
        description: {
            type: String,// clodernary url
            required: true,
        },
        duration: {
            type: Number, // clodnary in return it sends this
            required: true,
        },
        views: {
            type: Number, // clodnary in return it sends this
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
)

VideoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video", VideoSchema)