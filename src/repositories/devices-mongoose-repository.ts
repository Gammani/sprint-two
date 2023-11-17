import {DeviceDbType} from "../utils/types";
import {DeviceViewModel} from "../api/viewModels/DeviceViewModel";
import {DeviceModel} from "../mongo/device/device.model";

export class DevicesRepository {
    async addDevice(device: DeviceDbType): Promise<DeviceViewModel> {
        const deviceModelInstance = new DeviceModel({})
        deviceModelInstance.userId = device.userId
        deviceModelInstance.ip = device.ip
        deviceModelInstance.title = device.title
        deviceModelInstance.lastActiveDate = device.lastActiveDate
        const result = await deviceModelInstance.save()


        return {
            ip: result.ip,
            title: result.title,
            lastActiveDate: result.lastActiveDate,
            deviceId: result._id.toString()
        }
    }
    async findDeviceByDeviceId(deviceId: string) {
        const result = await DeviceModel.findOne({_id: deviceId})
        return result
    }
    async findUserIdByDeviceId(deviseId: string): Promise<string | undefined> {
        debugger
        const result = await DeviceModel.findOne({_id: deviseId})
        return result?.userId
    }
    async findAndUpdateDeviceAfterRefresh(deviceId: string) {
        const result = DeviceModel.findOneAndUpdate({_id: deviceId}, {$set: {lastActiveDate: new Date()}})
        return result
    }
    async findAllActiveSessionFromUserId(userId: string): Promise<DeviceViewModel[] | undefined> {
        const result = await DeviceModel.find({userId: userId})
        return result.map((i: DeviceDbType) => ({
            ip: i.ip,
            title: i.title,
            lastActiveDate: i.lastActiveDate,
            deviceId: i._id.toString()
        }))
    }
    async findDeviceFromUserId(deviceId: string, userId: string): Promise<boolean> {
        const result = await DeviceModel.findOne({_id: deviceId, userId: userId})
        if (result) {
            return true
        } else {
            return false
        }
    }
    async deleteCurrentSessionById(deviceId: string): Promise<boolean> {
        const result = await DeviceModel.deleteOne({_id: deviceId})
        debugger
        return result.deletedCount === 1;
    }
    async deleteAllSessionExcludeCurrent(deviceId: string) {
        const result = await DeviceModel.deleteMany({_id: {$ne: deviceId}})
        return
    }
    async deleteAll() {
        const result = await DeviceModel.deleteMany({})
        return
    }


    // для своего теста
    async findDeviceTestByUserId(userId: string) {
        const result = await DeviceModel.findOne({userId: userId})
        return result
    }
}


// export const devicesRepository = {
//     async addDevice(device: DeviceDbType): Promise<DeviceViewModel> {
//         const deviceModelInstance = new DeviceModel({})
//         deviceModelInstance.userId = device.userId
//         deviceModelInstance.ip = device.ip
//         deviceModelInstance.title = device.title
//         deviceModelInstance.lastActiveDate = device.lastActiveDate
//         const result = await deviceModelInstance.save()
//
//
//         return {
//             ip: result.ip,
//             title: result.title,
//             lastActiveDate: result.lastActiveDate,
//             deviceId: result._id.toString()
//         }
//     },
//     async findDeviceByDeviceId(deviceId: string) {
//         const result = await DeviceModel.findOne({_id: deviceId})
//         return result
//     },
//     async findUserIdByDeviceId(deviseId: string): Promise<string | undefined> {
//         debugger
//         const result = await DeviceModel.findOne({_id: deviseId})
//         return result?.userId
//     },
//     async findAndUpdateDeviceAfterRefresh(deviceId: string) {
//         const result = DeviceModel.findOneAndUpdate({_id: deviceId}, {$set: {lastActiveDate: new Date()}})
//         return result
//     },
//     async findAllActiveSessionFromUserId(userId: string): Promise<DeviceViewModel[] | undefined> {
//         const result =  await DeviceModel.find({userId: userId})
//         return result.map((i: DeviceDbType) => ({
//             ip: i.ip,
//             title: i.title,
//             lastActiveDate: i.lastActiveDate,
//             deviceId: i._id.toString()
//         }))
//     },
//     async findDeviceFromUserId(deviceId: string, userId: string): Promise<boolean> {
//         const result = await DeviceModel.findOne({_id: deviceId, userId: userId})
//         if(result) {
//             return true
//         } else {
//             return false
//         }
//     },
//     async deleteCurrentSessionById(deviceId: string): Promise<boolean> {
//         const result = await DeviceModel.deleteOne({_id: deviceId})
//         debugger
//         return result.deletedCount === 1;
//     },
//     async deleteAllSessionExcludeCurrent(deviceId: string) {
//         const result = await DeviceModel.deleteMany({_id: {$ne: deviceId}})
//         return
//     },
//     async deleteAll() {
//         const result = await DeviceModel.deleteMany({})
//         return
//     },
//
//
//
//
//     // для своего теста
//     async findDeviceTestByUserId(userId: string) {
//         const result = await DeviceModel.findOne({userId: userId})
//         return result
//     }
// }