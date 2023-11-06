import mongoose from 'mongoose'
import {WithId} from 'mongodb'
import {CommentatorInfoType, CommentDBType} from "../../utils/types";


const CommentatorInfoSchema = new mongoose.Schema<WithId<CommentatorInfoType>>({
    userId: String,
    userLogin: String
})

export const CommentSchema = new mongoose.Schema<CommentDBType>({
    content: {type: String, required: true},
    commentatorInfo: {type: CommentatorInfoSchema, required: true},
    createdAt: {type: String, required: true},
    _postId: {type: String, required: true}
})

export const CommentModel = mongoose.model<CommentDBType>('comment', CommentSchema)