import {UserType} from "../utils/types";
import jwt from 'jsonwebtoken'
import {settings} from "../settings";

export const jwtServices = {
    async createJWT(user: UserType) {
        const token = await jwt.sign({userId: user.id}, settings.JWT_SECRET, {expiresIn: '10000000000000000h'})
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