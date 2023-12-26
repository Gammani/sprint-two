import mongoose from 'mongoose'
import {WithId} from 'mongodb'
import {RequestForApiType} from "../../utils/types";

export const RequestForApiSchema = new mongoose.Schema<WithId<RequestForApiType>>({
    IP: {type: String, required: true},
    URL: {type: String, required: true},
    date: {type: Date, required: true}
})

export const RequestForApiModel = mongoose.model<RequestForApiType>('requestForApis', RequestForApiSchema)