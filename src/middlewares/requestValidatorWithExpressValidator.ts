import {NextFunction, Request, Response} from "express";
import {body, CustomValidator, validationResult} from "express-validator";
import {ErrorsType} from "../utils/types";
import {BlogViewModel} from "../models/BlogViewModel";
import {HTTP_STATUSES} from "../utils/utils";
import {jwtServices} from "../application/jwt-service";
import {usersService} from "../application/users-service";
import {securityDevicesService} from "../application/sequrity-devices-service";
import {blogsRepository} from "../repositories/blogs-mongoose-repository";
import {usersRepository} from "../repositories/users-mongoose-repository";
import {expiredTokensRepository} from "../repositories/expiredToken-mongoose-repository";


export const authRegistrationValidation = [
    body('login').isString().trim().isLength({min: 3, max: 10}).notEmpty().matches(/^[a-zA-Z0-9_-]*$/),
    body('password').isString().trim().isLength({min: 6, max: 20}).notEmpty().exists(),
    body('email').isString().trim().notEmpty().matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).exists()
]
export const authLoginValidation = [
    body('loginOrEmail').isString().trim().notEmpty(),
    body('password').isString().trim().notEmpty(),
]
export const authRegistrationConfirmationValidation = [
    body('code').isString().trim().notEmpty(),
]
export const authRegistrationEmailResendingValidation = [
    body('email').isString().trim().notEmpty().matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/),
]

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
export const checkedEmail = async (req: Request, res: Response, next: NextFunction) => {
    const error = validationResult(req).mapped();
    let errors: ErrorsType = {errorsMessages: []}
    Object.keys(error).forEach(a => errors.errorsMessages.push({message: `не валидное поле ${error[a].param}`, field: error[a].param}))

    if(errors.errorsMessages.length > 0) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
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
        await securityDevicesService.findAndUpdateDeviceAfterRefresh(deviceId)
        debugger
        expiredTokensRepository.addTokenToDB(foundUser!._id.toString(), token)
        console.log(foundUser)
        req.user = {
            email: foundUser!.accountData.email,
            login: foundUser!.accountData.login,
            userId: foundUser!._id.toString(),
            deviceId: deviceId
        }
        next()
    } else {
        res.send(HTTP_STATUSES.NO_UNAUTHORIZED_401)
        return
    }
}
export const checkAndRemoveRefreshTokenById = async (req: Request, res: Response, next: NextFunction) => {
    debugger
    const userIdFromURI = await securityDevicesService.findUserIdByDeviceId(req.params.deviceId)  // левый юзер
    if(!userIdFromURI) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }
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
    const deviceId: string | null = await jwtServices.getDeviceIdByRefreshToken(token)
    // if(deviceId !== req.params.deviceId) {
    //     res.sendStatus(HTTP_STATUSES.FORBIDDEN_403)
    //     return
    // }
    if(deviceId) {
        debugger
        // const UserId: string | undefined = await securityDevicesService.findUserIdByDeviceId(deviceId)
        const foundUser = await usersService.findUserByDeviceId(deviceId)
        debugger
        if(foundUser) {
            const isFoundDeviceFromUserId = await securityDevicesService.findDeviceFromUserId(deviceId, userIdFromURI)
            // мне приходит токен а в парамс приходит deviceId, нужно узнать является ли deviceId тому же юзеру что и токен. DeviceId
            // вытащили из токена.
            // токен который указан в id

            if(isFoundDeviceFromUserId) {
                // expiredTokensRepository.addTokenToDB(foundUser.accountData.id, token) КОММЕНТ
                console.log(foundUser)
                req.user = {
                    email: foundUser.accountData.email,
                    login: foundUser.accountData.login,
                    userId: foundUser._id.toString(),
                    deviceId: req.params.deviceId
                }
                next()
            } else {
                res.send(HTTP_STATUSES.FORBIDDEN_403)
                return
            }

        } else {
            res.send(HTTP_STATUSES.FORBIDDEN_403)
            return
        }

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
    const deviceId: string | null = await jwtServices.getDeviceIdByRefreshToken(token)
    if(deviceId) {
        debugger
        // const UserId: string | undefined = await securityDevicesService.findUserIdByDeviceId(deviceId)
        const foundUser = await usersService.findUserByDeviceId(deviceId)
        debugger
        console.log(foundUser)
        req.user = {
            email: foundUser!.accountData.email,
            login: foundUser!.accountData.login,
            userId: foundUser!._id.toString(),
            deviceId: deviceId
        }
        next()
    } else {
        res.send(HTTP_STATUSES.NO_UNAUTHORIZED_401)
        return
    }
}


export const isValidId: CustomValidator = async (blogId) => {
    const foundBlogger: BlogViewModel | null = await blogsRepository.findBlogById(blogId)
    if(!foundBlogger) {
        return Promise.reject('blogId не валидный')
    } else {
        return true
    }
}