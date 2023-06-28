import {NextFunction, Request, Response} from "express";
import {CustomValidator, validationResult} from "express-validator";
import {ErrorsType, UserType} from "../utils/types";
import {BloggerViewModel} from "../models/BloggerViewModel";
import {bloggersRepository} from "../repositories/bloggers-db-repository";
import {HTTP_STATUSES} from "../utils/utils";
import {usersRepository} from "../repositories/users-db-repository";
import {expiredTokensRepository} from "../repositories/expiredTokens-db-repository";
import {jwtServices} from "../application/jwt-service";
import {usersService} from "../domain/users-service";
import {securityDevicesService} from "../domain/sequrity-devices-service";


export const checkedValidation = (req: Request, res: Response, next: NextFunction) => {
    const error = validationResult(req).mapped();
    let errors: ErrorsType = {errorsMessages: []}
    Object.keys(error).forEach(a => errors.errorsMessages.push({message: `не валидное поле ${error[a].param}`, field: error[a].param}))

    if(errors.errorsMessages.length > 0) {
        res.status(HTTP_STATUSES.BAD_REQUEST_400).send(errors)
    } else {
        next()
    }
}
export const checkedExistsForLoginOrEmail = async (req: Request, res: Response, next: NextFunction) => {
    let errors: ErrorsType = {errorsMessages: []}
    const foundUserByLogin = await usersRepository.findUserByLogin(req.body.login)
    if(foundUserByLogin) {
        errors.errorsMessages.push({message: `не валидное поле login`, field: 'login'})
    }
    const foundUserByEmail = await usersRepository.findUserByEmail(req.body.email)
    if(foundUserByEmail) {
        errors.errorsMessages.push({message: `не валидное поле email`, field: 'email'})
    }
    if(errors.errorsMessages.length > 0) {
        res.status(HTTP_STATUSES.BAD_REQUEST_400).send(errors)
    } else {
        next()
    }
}
export const checkedConfirmedEmail = async (req: Request, res: Response, next: NextFunction) => {
    let errors: ErrorsType = {errorsMessages: []}
    const foundUser = await usersRepository.findUserByEmail(req.body.email)
    if(!foundUser) {
        errors.errorsMessages.push({message: `не валидное поле email`, field: 'email'})
    }
    if(foundUser?.emailConfirmation.isConfirmed) {
        errors.errorsMessages.push({message: `не валидное поле email`, field: 'email'})
    }
    if(errors.errorsMessages.length > 0) {
        res.status(HTTP_STATUSES.BAD_REQUEST_400).send(errors)
    } else {
        next()
    }
}

export const checkAndUpdateRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
    debugger
    if(!req.cookies.refreshToken) {
        res.sendStatus(HTTP_STATUSES.NO_UNAUTHORIZED_401)
        return
    }
    debugger
    if(await expiredTokensRepository.findToken(req.cookies.refreshToken)) {
        res.sendStatus(HTTP_STATUSES.NO_UNAUTHORIZED_401)
        return
    }
    debugger
    const token = req.cookies.refreshToken
    console.log("token = ", token)
    // jwt.verify(token, settings.JWT_SECRET, function(err: any, decoded: any) {
    //     if (err) {
    //         /*
    //           err = {
    //             name: 'TokenExpiredError',
    //             message: 'jwt expired',
    //             expiredAt: 1408621000
    //           }
    //         */
    //     }
    // });
debugger
    const isExpiredToken = await expiredTokensRepository.isExpiredToken(token)
    if(isExpiredToken) {
        res.sendStatus(HTTP_STATUSES.NO_UNAUTHORIZED_401)
        return
    }
    debugger
    const deviceId: string | null = await jwtServices.getDeviceIdByRefreshToken(token)
    if(deviceId) {
        debugger
        // const UserId: string | undefined = await securityDevicesService.findUserIdByDeviceId(deviceId)
        const foundUser = await usersService.findUserByDeviceId(deviceId)
        debugger
        expiredTokensRepository.addTokenToDB(foundUser!.accountData.id, token)
        console.log(foundUser)
        req.user = {
            email: foundUser!.accountData.email,
            login: foundUser!.accountData.login,
            userId: foundUser!.accountData.id,
            deviceId: deviceId
        }
        next()
    } else {
        res.send(HTTP_STATUSES.NO_UNAUTHORIZED_401)
        return
    }
}


export const checkRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
    debugger
    if(!req.cookies.refreshToken) {
        res.sendStatus(HTTP_STATUSES.NO_UNAUTHORIZED_401)
        return
    }
    debugger
    if(await expiredTokensRepository.findToken(req.cookies.refreshToken)) {
        res.sendStatus(HTTP_STATUSES.NO_UNAUTHORIZED_401)
        return
    }
    debugger
    const token = req.cookies.refreshToken
    console.log("token = ", token)

    debugger
    const isExpiredToken = await expiredTokensRepository.isExpiredToken(token)
    if(isExpiredToken) {
        res.sendStatus(HTTP_STATUSES.NO_UNAUTHORIZED_401)
        return
    }
    debugger
    const userId: string = await jwtServices.getUserIdByRefreshToken(token)
    if(userId) {
        debugger
        const foundUser: UserType | null = await usersService.findUserById(userId)
        console.log(foundUser)
        req.user = {
            email: foundUser!.accountData.email,
            login: foundUser!.accountData.login,
            userId: foundUser!.accountData.id
        }
        next()
    } else {
        res.send(HTTP_STATUSES.NO_UNAUTHORIZED_401)
        return
    }
}


export const isValidId: CustomValidator = async (blogId) => {
    const foundBlogger: BloggerViewModel | null = await bloggersRepository.findBloggerById(blogId)
    if(!foundBlogger) {
        return Promise.reject('blogId не валидный')
    } else {
        return true
    }
}