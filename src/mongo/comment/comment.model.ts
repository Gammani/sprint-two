import mongoose from 'mongoose'
import {ObjectId, WithId} from 'mongodb'
import {CommentatorInfoType, CommentDBType, LikesInfoType, LikeStatus} from "../../utils/types";


const CommentatorInfoSchema = new mongoose.Schema<WithId<CommentatorInfoType>>({
    userId: String,
    userLogin: String
})
const CommentatorLikesInfo = new mongoose.Schema<WithId<LikesInfoType>>({
    likesCount: Number,
    dislikesCount: Number,
    myStatus: {type: String, enum: Object.keys(LikeStatus), required: true},
})

export const CommentSchema = new mongoose.Schema<CommentDBType>({
    content: {type: String, required: true},
    commentatorInfo: {type: CommentatorInfoSchema, required: true},
    createdAt: {type: String, required: true},
    _postId: {type: ObjectId, required: true},
    _blogId: {type: ObjectId, required: true},
    likesInfo: {type: CommentatorLikesInfo, required: true}
})

export const CommentModel = mongoose.model<CommentDBType>('comment', CommentSchema)