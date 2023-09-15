import mongoose from 'mongoose'
import {WithId} from 'mongodb'
import {CommentatorInfoType, CommentType} from "../../utils/types";


const CommentatorInfoSchema = new mongoose.Schema<CommentatorInfoType>({
    userId: String,
    userLogin: String
})

export const CommentSchema = new mongoose.Schema<WithId<CommentType>>({
    content: {type: String, required: true},
    commentatorInfo: {type: CommentatorInfoSchema, required: true},
    createdAt: {type: String, required: true},
    _postId: {type: String, required: true}
})

export const CommentModel = mongoose.model<CommentType>('comment', CommentSchema)