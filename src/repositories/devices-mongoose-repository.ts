import {DeviceType} from "../utils/types";
import {DeviceViewModel} from "../api/viewModels/DeviceViewModel";
import {DeviceModel} from "../mongo/device/device.model";

export const devicesRepository = {
    async addDevice(device: DeviceType): Promise<DeviceViewModel> {
        const deviceModelInstance = new DeviceModel({})
        deviceModelInstance.userId = device.userId
        deviceModelInstance.ip = device.ip
        deviceModelInstance.title = device.title
        deviceModelInstance.lastActiveDate = device.lastActiveDate
        deviceModelInstance.deviceId = device.deviceId
        await deviceModelInstance.save()


        return {
            ip: device.ip,
            title: device.title,
            lastActiveDate: device.lastActiveDate,
            deviceId: device.deviceId
        }
    },
    async findDeviceByDeviceId(deviceId: string) {
        const result = await DeviceModel.findOne({deviceId: deviceId})
        return result
    },
    async findUserIdByDeviceId(deviseId: string): Promise<string | undefined> {
        const result = await DeviceModel.findOne({deviceId: deviseId})
        return result?.userId
    },
    async findAndUpdateDeviceAfterRefresh(deviceId: string) {
        const result = DeviceModel.findOneAndUpdate({deviceId: deviceId}, {$set: {lastActiveDate: new Date()}})
        return result
    },
    async findAllActiveSessionFromUserId(userId: string): Promise<DeviceViewModel[] | undefined> {
        const result =  await DeviceModel.find({userId: userId}, {projection: {_id: 0, userId: 0}})
        return result
    },
    async findDeviceFromUserId(deviceId: string, userId: string): Promise<boolean> {
        const result = await DeviceModel.findOne({deviceId: deviceId, userId: userId})
        if(result) {
            return true
        } else {
            return false
        }
    },
    async deleteCurrentSessionById(deviceId: string): Promise<boolean> {
        const result = await DeviceModel.deleteOne({deviceId: deviceId})
        debugger
        return result.deletedCount === 1;
    },
    async deleteAllSessionExcludeCurrent(deviceId: string) {
        const result = await DeviceModel.deleteMany({deviceId: {$ne: deviceId}})
        return
    },
    async deleteAll() {
        const result = await DeviceModel.deleteMany({})
        return
    }
}