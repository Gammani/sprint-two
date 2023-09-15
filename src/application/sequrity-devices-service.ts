
import {DeviceType} from "../utils/types";
import {DeviceViewModel} from "../models/DeviceViewModel";
import {devicesRepository} from "../repositories/devices-mongoose-repository";

export const securityDevicesService = {
    async addDevice(device: DeviceType): Promise<DeviceViewModel> {
        return await devicesRepository.addDevice(device)
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