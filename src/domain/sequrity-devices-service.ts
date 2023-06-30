import {devicesRepository} from "../repositories/devices-db-repository";
import {DevicesType} from "../utils/types";
import {DeviceViewModel} from "../models/DeviceViewModel";

export const securityDevicesService = {
    async addDevice(device: DevicesType): Promise<DeviceViewModel> {
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