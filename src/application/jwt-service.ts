import jwt from 'jsonwebtoken'
import {settings} from "../settings";
import {securityDevicesService} from "./sequrity-devices-service";
import {expiredTokensRepository} from "../repositories/expiredToken-mongoose-repository";

interface JwtPayload {
    deviceId: string;
}

export const jwtServices = {
    async createAccessJWT(userId: string) {
        const token = await jwt.sign({userId}, settings.JWT_SECRET, {expiresIn: '600000'})
        return token
    },
    async createRefreshJWT(deviceId: string) {
        // const token = await jwt.sign({userId}, settings.JWT_SECRET, {expiresIn: '20000'})
        const token = await jwt.sign({deviceId: deviceId}, settings.JWT_SECRET, {expiresIn: '1200000'})


        return token
    },
    async checkRefreshJWT(token: string) {
        const foundToken = expiredTokensRepository.findToken(token)
    },
    async getUserIdByAccessToken(token: string) {
        try {
            const result: any = await jwt.verify(token, settings.JWT_SECRET)
            console.log("result = ", result)
            return result
        } catch (error: any) {
            debugger
            console.log(error.message)
            return null
        }
    },
    async getUserIdByRefreshToken(token: string) {
        try {
            debugger
            const result: any = await jwt.verify(token, settings.JWT_SECRET)
            console.log("result = ", result)
            const userId: any = await securityDevicesService.findUserIdByDeviceId(result.deviceId)
            return userId
        } catch (error: any) {
            debugger
            console.log(error.message)
            return null
        }
    },
    async getDeviceIdByRefreshToken(token: string) {
        try {
            debugger
            const result = await jwt.verify(token, settings.JWT_SECRET) as JwtPayload
            console.log("is result = ", result)
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