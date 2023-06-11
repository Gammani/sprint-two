import {ExpiredTokenType} from "../utils/types";
import {expiredTokensCollection} from "./db";
import jwt from "jsonwebtoken";
import {settings} from "../settings";

export const expiredTokensRepository = {
    async addTokenToDB(userId: string, token: string) {
        const expiredToken: ExpiredTokenType = {userId, token}
        await expiredTokensCollection.insertOne(expiredToken)
        return
    },
    async findToken(token: string): Promise<ExpiredTokenType | null> {
        return await expiredTokensCollection.findOne({token})
    },
    async isExpiredToken(token: string): Promise<boolean> {
        try {
            const result: any = await jwt.verify(token, settings.JWT_SECRET)
            // console.log("result = ", result)
            return false
        } catch (error: any) {
            console.log(error.message)
            return true
        }
    }
}