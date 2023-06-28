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
    async deleteAll() {
        const result = await devicesCollection.deleteMany({})
        return
    }
}