import mongoose from 'mongoose'
import {WithId} from 'mongodb'
import {BlogType} from '../../utils/types'

export const BlogSchema = new mongoose.Schema<WithId<BlogType>>({
    name: {type: String, required: true},
    description: {type: String, required: true},
    websiteUrl: {type: String, required: true},
    createdAt: {type: String, required: true},
    isMembership: {type: Boolean, required: true}
})

export const BlogModel = mongoose.model<BlogType>('blog', BlogSchema)