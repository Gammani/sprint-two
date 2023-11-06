import mongoose from 'mongoose'
import {WithId} from 'mongodb'
import {ExpiredTokenType} from "../../utils/types";


export const ExpiredTokenSchema = new mongoose.Schema<WithId<ExpiredTokenType>>({
    userId: {type: String, required: true},
    refreshToken: {type: String, required: true}
})

export const ExpiredTokenModel = mongoose.model<ExpiredTokenType>('expiredTokens', ExpiredTokenSchema)