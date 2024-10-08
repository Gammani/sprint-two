import {DeviceViewModel} from "../api/viewModels/DeviceViewModel";
import {ObjectId} from "mongodb";
import {Device} from "../utils/types";
import {DevicesRepository} from "../repositories/devices-mongoose-repository";
import {inject, injectable} from "inversify";


@injectable()
export class SecurityDevicesService {
    constructor(@inject(DevicesRepository) protected devicesRepository: DevicesRepository) {}

    async addDevice(userId: ObjectId, ip: string, headerTitle: string): Promise<DeviceViewModel> {
        const createDevice = new Device(
            new ObjectId,
            userId.toString(),
            ip,
            headerTitle,
            new Date(),)
        const result =  await this.devicesRepository.addDevice(createDevice)
        return result
    }
    async findDeviceByDeviceId(deviceId: string) {
        return await this.devicesRepository.findDeviceByDeviceId(deviceId)
    }
    async findUserIdByDeviceId(deviseId: string): Promise<string | undefined> {
        debugger
        return await this.devicesRepository.findUserIdByDeviceId(deviseId)
    }
    async findAndUpdateDeviceAfterRefresh(deviceId: string) {
        return await this.devicesRepository.findAndUpdateDeviceAfterRefresh(deviceId)
    }
    async findDeviceFromUserId(deviceId: string, userId: string) {
        return this.devicesRepository.findDeviceFromUserId(deviceId, userId)
    }
    async findAllActiveSessionFromUser(userId: string): Promise<DeviceViewModel[] | undefined> {
        return await this.devicesRepository.findAllActiveSessionFromUserId(userId)
    }
    async deleteCurrentSessionById(deviceId: string): Promise<boolean> {
        const result = await this.devicesRepository.deleteCurrentSessionById(deviceId)
        return result
    }
    async deleteAllSessionExcludeCurrent(deviceId: string) {
        const result = await this.devicesRepository.deleteAllSessionExcludeCurrent(deviceId)
        return
    }
}