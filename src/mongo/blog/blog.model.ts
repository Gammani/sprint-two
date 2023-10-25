import mongoose from 'mongoose'
import {WithId} from 'mongodb'
import {Blog} from '../../utils/types'

export const BlogSchema = new mongoose.Schema<WithId<Blog>>({
    name: {type: String, required: true},
    description: {type: String, required: true},
    websiteUrl: {type: String, required: true},
    createdAt: {type: String, required: true},
    isMembership: {type: Boolean, required: true}
})

export const BlogModel = mongoose.model<Blog>('blog', BlogSchema)