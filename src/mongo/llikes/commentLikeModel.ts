import * as mongoose from "mongoose"
import {CommentLikeDbType, LikeStatus} from "../../utils/types"
import {ObjectId} from "mongodb"


export const CommentLikeSchema = new mongoose.Schema<CommentLikeDbType>({
    userId: {type: ObjectId, required: true},
    login: {type: String, required: true},
    blogId: {type: ObjectId, required: true},
    postId: {type: ObjectId, required: true},
    commentId: {type: ObjectId, required: true},
    likeStatus: {type: String, enum: LikeStatus, required: true},
    addedAt: {type: Date, required: true},
    lastUpdate: {type: Date, required: true}
})

export const CommentLikeModel = mongoose.model<CommentLikeDbType>('commentLikes', CommentLikeSchema)