import mongoose from "mongoose"
import {LikeStatus, PostLikeDbType} from "../../utils/types";
import {ObjectId} from "mongodb";


export const PostLikeSchema = new mongoose.Schema<PostLikeDbType>({
    userId: {type: ObjectId, required: true},
    login: {type: String, required: true},
    blogId: {type: ObjectId, required: true},
    postId: {type: ObjectId, required: true},
    likeStatus: {type: String, enum: LikeStatus, required: true},
    addedAt: {type: String, required: true},
    lastUpdate: {type: String, required: true}
})

export const PostLikeModel = mongoose.model<PostLikeDbType>('postLikes', PostLikeSchema)