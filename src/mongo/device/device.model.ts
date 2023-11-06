import mongoose from 'mongoose'
import {DeviceDbType} from "../../utils/types";


export const DeviceSchema = new mongoose.Schema<DeviceDbType>({
    userId: {type: String, required: true},
    ip: {type: String, required: true},
    title: {type: String, required: true},
    lastActiveDate: {type: Date, required: true}
})

export const DeviceModel = mongoose.model<DeviceDbType>('devices', DeviceSchema)