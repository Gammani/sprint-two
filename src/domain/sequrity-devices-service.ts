import {devicesRepository} from "../repositories/devices-db-repository";
import {DevicesType} from "../utils/types";
import {DeviceViewModel} from "../models/DeviceViewModel";

export const securityDevicesService = {
    async addDevice(device: DevicesType): Promise<DeviceViewModel> {
        return await devicesRepository.addDevice(device)
    },
    async findUserIdByDeviceId(deviseId: string): Promise<string | undefined> {
        debugger
        return await devicesRepository.findUserIdByDeviceId(deviseId)
    },
    async findAllActiveSessionFromUser(userId: string): Promise<DeviceViewModel[] | undefined> {
        return await devicesRepository.findAllActiveSessionFromUserId(userId)
    },
    async deleteAllSessionExcludeCurrent(deviceId: string) {
        const result = await devicesRepository.deleteAllSessionExcludeCurrent(deviceId)
        return
    }
}