import {devicesCollection} from "./db";
import {DevicesType} from "../utils/types";
import {DeviceViewModel} from "../models/DeviceViewModel";

export const devicesRepository = {
    async addDevice(device: DevicesType): Promise<DeviceViewModel> {
        await devicesCollection.insertOne({...device})
        return {
            ip: device.ip,
            title: device.title,
            lastActiveDate: device.lastActiveDate,
            deviceId: device.deviceId
        }
    },
    async findUserIdByDeviceId(deviseId: string): Promise<string | undefined> {
        const result = await devicesCollection.findOne({deviceId: deviseId})
        return result?.userId
    },
    async findAllActiveSessionFromUserId(userId: string): Promise<DeviceViewModel[] | undefined> {
        const result =  await devicesCollection.find({userId: userId}, {projection: {_id: 0, userId: 0}}).toArray()
        return result
    },
    async deleteAllSessionExcludeCurrent(deviceId: string) {
        const result = await devicesCollection.deleteMany({deviceId: {$ne: deviceId}})
        return
    },
    async deleteAll() {
        const result = await devicesCollection.deleteMany({})
        return
    }
}