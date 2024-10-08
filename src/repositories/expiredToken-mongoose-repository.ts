import {injectable} from "inversify";
import {ExpiredTokenType} from "../utils/types";
import jwt from "jsonwebtoken";
import {settings} from "../settings";
import {ExpiredTokenModel} from "../mongo/expiredToken/expiredToken.model";




@injectable()
export class ExpiredTokenRepository {
    async addTokenToDB(userId: string, token: string) {
        const expiredTokenInstance = new ExpiredTokenModel({})

        expiredTokenInstance.userId = userId
        expiredTokenInstance.refreshToken = token
        await expiredTokenInstance.save()

        return
    }
    async findToken(token: string): Promise<ExpiredTokenType | null> {
        debugger
        return await ExpiredTokenModel.findOne({refreshToken: token})
    }
    async isExpiredToken(token: string): Promise<boolean> {
        debugger
        try {
            const result: any = await jwt.verify(token, settings.JWT_SECRET)
            // console.log("result = ", result)
            return false
        } catch (error: any) {
            console.log(error.message)
            return true
        }
    }
    async deleteAll() {
        const result = await ExpiredTokenModel.deleteMany({})
        return
    }
}