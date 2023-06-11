import {UserType} from "../utils/types";
import jwt from 'jsonwebtoken'
import {settings} from "../settings";
import {expiredTokensCollection} from "../repositories/db";
import {expiredTokensRepository} from "../repositories/expiredTokens-db-repository";

export const jwtServices = {
    async createAccessJWT(userId: string) {
        const token = await jwt.sign({userId}, settings.JWT_SECRET, {expiresIn: '10000'})
        return token
    },
    async createRefreshJWT(userId: string) {
        const token = await jwt.sign({userId}, settings.JWT_SECRET, {expiresIn: '20000'})
        return token
    },
    async checkRefreshJWT(token: string) {
        const foundToken = expiredTokensRepository.findToken(token)
    },
    async getUserIdByToken(token: string) {
        try {
            const result: any = await jwt.verify(token, settings.JWT_SECRET)
            // console.log("result = ", result)
            return result.userId
        } catch (error: any) {
            debugger
            console.log(error.message)
            return null
        }
    }
}