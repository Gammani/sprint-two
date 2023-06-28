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
    }
}