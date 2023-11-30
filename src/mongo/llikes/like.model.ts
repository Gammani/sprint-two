import * as mongoose from "mongoose";
import {LikeDbType, LikeStatus} from "../../utils/types";
import {ObjectId} from "mongodb";


export const LikeSchema = new mongoose.Schema<LikeDbType>({
    userId: {type: ObjectId, required: true},
    blogId: {type: ObjectId, required: true},
    postId: {type: ObjectId, required: true},
    commentId: {type: ObjectId, required: true},
    likeStatus: {type: String, enum: LikeStatus, required: true},
    createdAt: {type: Date, required: true},
    lastUpdate: {type: Date, required: true}
})

export const LikeModel = mongoose.model<LikeDbType>('like', LikeSchema)