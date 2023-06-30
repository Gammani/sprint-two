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
    async findDeviceByDeviceId(deviceId: string) {
        const result = await devicesCollection.findOne({deviceId: deviceId})
        return result
    },
    async findUserIdByDeviceId(deviseId: string): Promise<string | undefined> {
        const result = await devicesCollection.findOne({deviceId: deviseId})
        return result?.userId
    },
    async findAndUpdateDeviceAfterRefresh(deviceId: string) {
        const result = devicesCollection.findOneAndUpdate({deviceId: deviceId}, {$set: {lastActiveDate: new Date()}})
        return result
    },
    async findAllActiveSessionFromUserId(userId: string): Promise<DeviceViewModel[] | undefined> {
        const result =  await devicesCollection.find({userId: userId}, {projection: {_id: 0, userId: 0}}).toArray()
        return result
    },
    async findDeviceFromUserId(deviceId: string, userId: string): Promise<boolean> {
        const result = await devicesCollection.findOne({deviceId: deviceId, userId: userId})
        if(result) {
            return true
        } else {
            return false
        }
    },
    async deleteCurrentSessionById(deviceId: string): Promise<boolean> {
        const result = await devicesCollection.deleteOne({deviceId: deviceId})
        debugger
        return result.deletedCount === 1;
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