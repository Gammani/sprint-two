import mongoose from 'mongoose'
import {ExtendedLikesInfoType, LikeStatus, NewestLikesType, PostDbType} from '../../utils/types'
import {ObjectId, WithId} from "mongodb";


const NewestLikesSchema = new mongoose.Schema<WithId<NewestLikesType>>({
    addedAt: {type: String, required: true},
    userId: {type: ObjectId, required: true},
    login: {type: String, required: true}
})

const ExtendedLikesInfoSchema = new mongoose.Schema<WithId<ExtendedLikesInfoType>>({
    likesCount: Number,
    dislikesCount: Number,
    myStatus: {type: String, enum: LikeStatus, required: true},
    newestLikes: {type: [NewestLikesSchema], required: true}
})

export const PostSchema = new mongoose.Schema<PostDbType>({
    title: {type: String, required: true},
    shortDescription: {type: String, required: true},
    content: {type: String, required: true},
    blogId: {type: String, required: true},
    blogName: {type: String, required: true},
    createdAt: {type: String, required: true},
    extendedLikesInfo: {type: ExtendedLikesInfoSchema, required: true}
})

export const PostModel = mongoose.model<PostDbType>('posts', PostSchema)