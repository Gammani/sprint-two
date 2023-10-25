import mongoose from 'mongoose'
import {WithId} from 'mongodb'
import {Post} from '../../utils/types'

export const PostSchema = new mongoose.Schema<WithId<Post>>({
    title: {type: String, required: true},
    shortDescription: {type: String, required: true},
    content: {type: String, required: true},
    blogId: {type: String, required: true},
    blogName: {type: String, required: true},
    createdAt: {type: String, required: true}
})

export const PostModel = mongoose.model<Post>('post', PostSchema)