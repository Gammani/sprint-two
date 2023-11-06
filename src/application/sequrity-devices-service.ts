import {DeviceViewModel} from "../api/viewModels/DeviceViewModel";
import {devicesRepository} from "../repositories/devices-mongoose-repository";
import {ObjectId} from "mongodb";
import {Device} from "../utils/types";

export const securityDevicesService = {
    async addDevice(userId: ObjectId, ip: string, headerTitle: string): Promise<DeviceViewModel> {
        const createDevice = new Device(
            new ObjectId,
            userId.toString(),
            ip,
            headerTitle,
            new Date(),)
        const result =  await devicesRepository.addDevice(createDevice)
        return result
    },
    async findDeviceByDeviceId(deviceId: string) {
        return await devicesRepository.findDeviceByDeviceId(deviceId)
    },
    async findUserIdByDeviceId(deviseId: string): Promise<string | undefined> {
        debugger
        return await devicesRepository.findUserIdByDeviceId(deviseId)
    },
    async findAndUpdateDeviceAfterRefresh(deviceId: string) {
        return await devicesRepository.findAndUpdateDeviceAfterRefresh(deviceId)
    },
    async findDeviceFromUserId(deviceId: string, userId: string) {
        return devicesRepository.findDeviceFromUserId(deviceId, userId)
    },
    async findAllActiveSessionFromUser(userId: string): Promise<DeviceViewModel[] | undefined> {
        return await devicesRepository.findAllActiveSessionFromUserId(userId)
    },
    async deleteCurrentSessionById(deviceId: string): Promise<boolean> {
        const result = await devicesRepository.deleteCurrentSessionById(deviceId)
        return result
    },
    async deleteAllSessionExcludeCurrent(deviceId: string) {
        const result = await devicesRepository.deleteAllSessionExcludeCurrent(deviceId)
        return
    }
}