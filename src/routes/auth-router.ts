import {Request, Response, Router} from "express";
import {DeviceType, RequestWithBody, UserTypeDbModel} from "../utils/types";
import {CreateAuthModel} from "../models/CreateAuthModel";
import {
    authLoginValidation,
    authRegistrationConfirmationValidation,
    authRegistrationEmailResendingValidation,
    authRegistrationValidation,
    checkAndUpdateRefreshToken,
    checkedConfirmedEmail,
    checkedExistsForLoginOrEmail,
    checkedValidation
} from "../middlewares/requestValidatorWithExpressValidator";
import {usersService} from "../application/users-service";
import {HTTP_STATUSES} from "../utils/utils";
import {jwtServices} from "../application/jwt-service";
import {authBearerMiddleware} from "../middlewares/auth-middleware";
import {RequestUserViewModel, UserViewModel} from "../models/UserViewModel";
import {CreateUserModel} from "../models/CreateUserModel";
import {authService} from "../application/auth-service";
import {securityDevicesService} from "../application/sequrity-devices-service";
import {restrictionRequests} from "../middlewares/restriction-requests";

export const authRouter = Router({})

authRouter.post('/login',
    authLoginValidation,
    restrictionRequests,
    checkedValidation,

    async (req: RequestWithBody<CreateAuthModel>, res: Response) => {

        const user: UserTypeDbModel | null = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)
        if (user) {
            const device: DeviceType = {
                userId: user._id.toString(),
                ip: req.ip,
                title: req.headers['user-agent'] || "user-agent unknown",
                lastActiveDate: new Date(),
                deviceId: (+new Date()).toString()
            }
            debugger
            await securityDevicesService.addDevice(device)
            const accessToken = await jwtServices.createAccessJWT(user._id.toString())
            const refreshToken = await jwtServices.createRefreshJWT(device.deviceId)

            // res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true})
            res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true})

            res.status(HTTP_STATUSES.OK_200).send({accessToken: accessToken})
        } else {
            res.sendStatus(HTTP_STATUSES.NO_UNAUTHORIZED_401)
        }
    })

authRouter.post('/registration',
    authRegistrationValidation,
    restrictionRequests,
    checkedValidation,
    checkedExistsForLoginOrEmail,


    async (req: RequestWithBody<CreateUserModel>, res: Response) => {
        const newUser: UserViewModel | null = await usersService.createUser(req.body.login, req.body.email, req.body.password)

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    })

authRouter.post('/registration-confirmation',
    authRegistrationConfirmationValidation,
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
    authRegistrationEmailResendingValidation,
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

    async (req: Request, res: Response) => {
        await securityDevicesService.deleteCurrentSessionById(req.user!.deviceId!)
        res.cookie('refreshToken', "", {httpOnly: true, secure: true})
    res.send(HTTP_STATUSES.NO_CONTENT_204)
})

authRouter.get('/me',
    authBearerMiddleware,

    async (req: RequestWithBody<RequestUserViewModel>, res: Response) => {
        const foundUser = req.user
        res.send(foundUser)
    })