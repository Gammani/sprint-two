import {UserType} from "../utils/types";
import jwt from 'jsonwebtoken'
import {settings} from "../settings";

export const jwtServices = {
    async createAccessJWT(user: UserType) {
        const token = await jwt.sign({userId: user.accountData.id}, settings.JWT_SECRET, {expiresIn: '10'})
        return token
    },
    async createRefreshJWT(user: UserType) {
        const token = await jwt.sign({userId: user.accountData.id}, settings.JWT_SECRET, {expiresIn: '20'})
        return token
    },
    async getUserIdByToken(token: string) {
        try {
            const result: any = await jwt.verify(token, settings.JWT_SECRET)
            // console.log(result)
            return result.userId
        } catch (error: any) {
            debugger
            // console.log(error.message)
            return null
        }
    }
}