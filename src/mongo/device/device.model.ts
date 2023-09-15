import mongoose from 'mongoose'
import {WithId} from 'mongodb'
import {DeviceType} from "../../utils/types";


export const DeviceSchema = new mongoose.Schema<WithId<DeviceType>>({
    userId: {type: String, required: true},
    ip: {type: String, required: true},
    title: {type: String, required: true},
    lastActiveDate: {type: Date, required: true},
    deviceId: {type: String, required: true}
})

export const DeviceModel = mongoose.model<DeviceType>('devices', DeviceSchema)