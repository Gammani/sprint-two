import {Request, Response, Router} from "express";
import {DevicesType, RequestWithBody, UserType} from "../utils/types";
import {CreateAuthModel} from "../models/CreateAuthModel";
import {body} from "express-validator";
import {
    checkedConfirmedEmail,
    checkedExistsForLoginOrEmail,
    checkedValidation, checkAndUpdateRefreshToken
} from "../middlewares/requestValidatorWithExpressValidator";
import {usersService} from "../domain/users-service";
import {HTTP_STATUSES} from "../utils/utils";
import {jwtServices} from "../application/jwt-service";
import {authBearerMiddleware} from "../middlewares/auth-middleware";
import {RequestUserViewModel, UserViewModel} from "../models/UserViewModel";
import {CreateUserModel} from "../models/CreateUserModel";
import {authService} from "../domain/auth-service";
import {DeviceViewModel} from "../models/DeviceViewModel";
import {securityDevicesService} from "../domain/sequrity-devices-service";
import {restrictionRequests} from "../middlewares/restriction-requests";

export const authRouter = Router({})

authRouter.post('/login',
    body('loginOrEmail').isString().trim().notEmpty(),
    body('password').isString().trim().notEmpty(),
    restrictionRequests,
    checkedValidation,

    async (req: RequestWithBody<CreateAuthModel>, res) => {

        const user: UserType | null = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)
        if (user) {
            const device: DevicesType = {
                userId: user.accountData.id,
                ip: req.ip,
                title: req.headers['user-agent'] || "user-agent unknown",
                lastActiveDate: new Date(),
                deviceId: (+new Date()).toString()
            }
            debugger
            await securityDevicesService.addDevice(device)
            const accessToken = await jwtServices.createAccessJWT(user.accountData.id)
            const refreshToken = await jwtServices.createRefreshJWT(device.deviceId)

            // res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true})
            res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true})

            res.status(HTTP_STATUSES.OK_200).send({accessToken: accessToken})
        } else {
            res.sendStatus(HTTP_STATUSES.NO_UNAUTHORIZED_401)
        }
    })

authRouter.post('/registration',
    body('login').isString().trim().isLength({min: 3, max: 10}).notEmpty().matches(/^[a-zA-Z0-9_-]*$/),
    body('password').isString().trim().isLength({min: 6, max: 20}).notEmpty().exists(),
    body('email').isString().trim().notEmpty().matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).exists(),
    restrictionRequests,
    checkedValidation,
    checkedExistsForLoginOrEmail,


    async (req: RequestWithBody<CreateUserModel>, res: Response) => {
        const newUser: UserViewModel | null = await usersService.createUser(req.body.login, req.body.email, req.body.password)

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    })

authRouter.post('/registration-confirmation',
    body('code').isString().trim().notEmpty(),
    restrictionRequests,
    checkedValidation,


    async (req: RequestWithBody<{ code: string }>, res: Response) => {

        const result = await authService.confirmEmail(req.body.code)
        if (result) {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        } else {
            res.status(HTTP_STATUSES.BAD_REQUEST_400).send({
                "errorsMessages": [
                    {
                        "message": "не валидное поле code",
                        "field": "code"
                    }
                ]
            })
        }
    })

authRouter.post('/registration-email-resending',
    body('email').isString().trim().notEmpty().matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/),
    restrictionRequests,
    checkedValidation,
    checkedConfirmedEmail,

    async (req: RequestWithBody<{ email: string }>, res: Response) => {

        const result = await authService.resendCode(req.body.email)
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    })

authRouter.post('/refresh-token',
    checkAndUpdateRefreshToken,

    async (req: Request, res: Response) => {
    debugger
    const user = req.user
        if(user) {
            debugger
            const accessToken = await jwtServices.createAccessJWT(user.userId)
            const refreshToken = await jwtServices.createRefreshJWT(user.deviceId!)

            // res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true})
            res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true})

            res.status(HTTP_STATUSES.OK_200).send({accessToken: accessToken})
        }
})
authRouter.post('/logout',
    checkAndUpdateRefreshToken,

    (req: Request, res: Response) => {
        res.cookie('refreshToken', "", {httpOnly: true, secure: true})
    res.send(HTTP_STATUSES.NO_CONTENT_204)
})

authRouter.get('/me',
    authBearerMiddleware,

    async (req: RequestWithBody<RequestUserViewModel>, res: Response) => {
        const foundUser = req.user
        res.send(foundUser)
    })