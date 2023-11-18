import jwt from 'jsonwebtoken'
import {settings} from "../settings";
import {ExpiredTokenRepository} from "../repositories/expiredToken-mongoose-repository";
import {DevicesRepository} from "../repositories/devices-mongoose-repository";

interface JwtPayload {
    deviceId: string;
}

export class JwtService {
    constructor(protected expiredTokensRepository: ExpiredTokenRepository, protected devicesRepository: DevicesRepository) {}

    async createAccessJWT(userId: string) {
        const token = await jwt.sign({userId}, settings.JWT_SECRET, {expiresIn: '600000'})
        return token
    }
    async createRefreshJWT(deviceId: string) {
        // const token = await jwt.sign({userId}, settings.JWT_SECRET, {expiresIn: '20000'})
        const token = await jwt.sign({deviceId: deviceId}, settings.JWT_SECRET, {expiresIn: '1200000'})


        return token
    }
    async checkRefreshJWT(token: string) {
        const foundToken = this.expiredTokensRepository.findToken(token)
    }
    async getUserIdByAccessToken(token: string) {
        try {
            const result: any = await jwt.verify(token, settings.JWT_SECRET)
            return result
        } catch (error: any) {
            debugger
            console.log(error.message)
            return null
        }
    }
    async getUserIdByRefreshToken(token: string) {
        try {
            debugger
            const result: any = await jwt.verify(token, settings.JWT_SECRET)
            const userId: any = await this.devicesRepository.findUserIdByDeviceId(result.deviceId)
            return userId
        } catch (error: any) {
            debugger
            console.log(error.message)
            return null
        }
    }
    async getDeviceIdByRefreshToken(token: string) {
        try {
            debugger
            const result = await jwt.verify(token, settings.JWT_SECRET) as JwtPayload
            //const user: any = await securityDevicesService.findUserByDeviceId(result.deviceId)
            //return user.userId
            return result.deviceId
        } catch (error: any) {
            debugger
            console.log(error.message)
            return null
        }
    }
}