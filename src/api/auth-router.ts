import {Request, Response, Router} from "express";
import {UserTypeDbModel} from "../utils/types";
import {CreateAuthModel} from "../models/CreateAuthModel";
import {
    authLoginValidation,
    authNewPasswordValidation,
    authRegistrationConfirmationValidation,
    authRegistrationEmailResendingValidation,
    authRegistrationValidation,
    checkAndUpdateRefreshToken,
    checkedConfirmedEmail,
    checkedExistsForLoginOrEmail,
    checkedValidation
} from "../middlewares/requestValidatorWithExpressValidator";
import {UsersService} from "../application/users-service";
import {HTTP_STATUSES} from "../utils/utils";
import {JwtService} from "../application/jwt-service";
import {authBearerMiddleware} from "../middlewares/auth-middleware";
import {RequestUserViewModel, UserViewModel} from "./viewModels/UserViewModel";
import {CreateUserModel} from "../models/CreateUserModel";
import {AuthService} from "../application/auth-service";
import {SecurityDevicesService} from "../application/sequrity-devices-service";
import {restrictionRequests} from "../middlewares/restriction-requests";
import {RequestWithBody} from "./inputModels/inputModels";
import {DeviceViewModel} from "./viewModels/DeviceViewModel";

export const authRouter = Router({})

class AuthController {
    private usersService: UsersService
    private jwtServices: JwtService
    private authService: AuthService
    private securityDevicesService: SecurityDevicesService

    constructor() {
        this.usersService = new UsersService()
        this.jwtServices = new JwtService()
        this.authService = new AuthService()
        this.securityDevicesService = new SecurityDevicesService()
    }

    async login(req: RequestWithBody<CreateAuthModel>, res: Response) {

        const user: UserTypeDbModel | null = await this.usersService.checkCredentials(req.body.loginOrEmail, req.body.password)
        if (user) {
            const device: DeviceViewModel = await this.securityDevicesService.addDevice(user._id, req.ip, req.headers['user-agent'] || "user-agent unknown",)

            const accessToken = await this.jwtServices.createAccessJWT(user._id.toString())
            const refreshToken = await this.jwtServices.createRefreshJWT(device.deviceId)

            res.cookie('refreshToken', refreshToken, {httpOnly: false, secure: false})  // local
            // res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true})

            res.status(HTTP_STATUSES.OK_200).send({accessToken: accessToken})
        } else {
            res.sendStatus(HTTP_STATUSES.NO_UNAUTHORIZED_401)
        }
    }

    async registration(req: RequestWithBody<CreateUserModel>, res: Response) {
        const newUser: UserViewModel | null = await this.usersService.createUser(req.body.login, req.body.email, req.body.password)

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }

    async passwordRecovery(req: RequestWithBody<{ email: string }>, res: Response) {
        await this.authService.passwordRecovery(req.body.email)
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }

    async registrationConfirmation(req: RequestWithBody<{ code: string }>, res: Response) {
        const result = await this.authService.confirmEmail(req.body.code)
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
    }

    async registrationEmailResending(req: RequestWithBody<{ email: string }>, res: Response) {

        const result = await this.authService.resendCode(req.body.email)
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }

    async refreshToken(req: Request, res: Response) {
        debugger
        const user = req.user
        if (user) {
            debugger
            const accessToken = await this.jwtServices.createAccessJWT(user.userId)
            const refreshToken = await this.jwtServices.createRefreshJWT(user.deviceId!)

            res.cookie('refreshToken', refreshToken, {httpOnly: false, secure: false}) // local
            // res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true})

            res.status(HTTP_STATUSES.OK_200).send({accessToken: accessToken})
        }
    }

    async logout(req: Request, res: Response) {
        await this.securityDevicesService.deleteCurrentSessionById(req.user!.deviceId!)
        res.cookie('refreshToken', "", {httpOnly: false, secure: false})   // local
        // res.cookie('refreshToken', "", {httpOnly: true, secure: true})
        res.send(HTTP_STATUSES.NO_CONTENT_204)
    }

    async newPassword(req: RequestWithBody<{ newPassword: string, recoveryCode: string }>, res: Response) {
        debugger
        const foundUser = await this.usersService.findUserByRecoveryCode(req.body.recoveryCode)
        if (foundUser) {
            const result = await this.usersService.updatePassword(req.body.newPassword, req.body.recoveryCode)
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        } else {
            res.status(HTTP_STATUSES.BAD_REQUEST_400).send({
                "errorsMessages": [
                    {
                        "message": "не валидное поле recoveryCode",
                        "field": "recoveryCode"
                    }
                ]
            })
        }

    }

    async me(req: RequestWithBody<RequestUserViewModel>, res: Response) {
        const foundUser = req.user
        res.send(foundUser)
    }
}

const authController = new AuthController()

authRouter.post('/login',
    authLoginValidation,
    restrictionRequests,
    checkedValidation,
    authController.login.bind(authController)
)
authRouter.post('/registration',
    authRegistrationValidation,
    restrictionRequests,
    checkedValidation,
    checkedExistsForLoginOrEmail,
    authController.registration.bind(authController)
)
authRouter.post('/password-recovery',
    authRegistrationEmailResendingValidation,
    restrictionRequests,
    checkedValidation,
    authController.passwordRecovery.bind(authController)
)
authRouter.post('/registration-confirmation',
    authRegistrationConfirmationValidation,
    restrictionRequests,
    checkedValidation,
    authController.registrationConfirmation.bind(authController)
)
authRouter.post('/registration-email-resending',
    authRegistrationEmailResendingValidation,
    restrictionRequests,
    checkedValidation,
    checkedConfirmedEmail,
    authController.registrationEmailResending.bind(authController)
)
authRouter.post('/refresh-token',
    checkAndUpdateRefreshToken,
    authController.refreshToken.bind(authController)
)
authRouter.post('/logout',
    checkAndUpdateRefreshToken,
    authController.logout.bind(authController)
)
authRouter.post('/new-password',
    authNewPasswordValidation,
    restrictionRequests,
    checkedValidation,
    authController.newPassword.bind(authController)
)
authRouter.get('/me',
    authBearerMiddleware,
    authController.me.bind(authController)
)


// authRouter.post('/login',
//     authLoginValidation,
//     restrictionRequests,
//     checkedValidation,
//
//     async (req: RequestWithBody<CreateAuthModel>, res: Response) => {
//         debugger
//
//         const user: UserTypeDbModel | null = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)
//         if (user) {
//             const device: DeviceViewModel = await securityDevicesService.addDevice(user._id, req.ip, req.headers['user-agent'] || "user-agent unknown",)
//
//             debugger
//             const accessToken = await jwtServices.createAccessJWT(user._id.toString())
//             const refreshToken = await jwtServices.createRefreshJWT(device.deviceId)
//
//             res.cookie('refreshToken', refreshToken, {httpOnly: false, secure: false})  // local
//             // res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true})
//
//             res.status(HTTP_STATUSES.OK_200).send({accessToken: accessToken})
//         } else {
//             res.sendStatus(HTTP_STATUSES.NO_UNAUTHORIZED_401)
//         }
//     })
// authRouter.post('/registration',
//     authRegistrationValidation,
//     restrictionRequests,
//     checkedValidation,
//     checkedExistsForLoginOrEmail,
//
//
//     async (req: RequestWithBody<CreateUserModel>, res: Response) => {
//         const newUser: UserViewModel | null = await usersService.createUser(req.body.login, req.body.email, req.body.password)
//
//         res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
//     })
// authRouter.post('/password-recovery',
//     authRegistrationEmailResendingValidation,
//     restrictionRequests,
//     checkedValidation,
//
//
//     async (req: RequestWithBody<{ email: string }>, res: Response) => {
//         await authService.passwordRecovery(req.body.email)
//         res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
//     })
// authRouter.post('/registration-confirmation',
//     authRegistrationConfirmationValidation,
//     restrictionRequests,
//     checkedValidation,
//
//
//     async (req: RequestWithBody<{ code: string }>, res: Response) => {
//         const result = await authService.confirmEmail(req.body.code)
//         if (result) {
//             res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
//         } else {
//             res.status(HTTP_STATUSES.BAD_REQUEST_400).send({
//                 "errorsMessages": [
//                     {
//                         "message": "не валидное поле code",
//                         "field": "code"
//                     }
//                 ]
//             })
//         }
//     })
// authRouter.post('/registration-email-resending',
//     authRegistrationEmailResendingValidation,
//     restrictionRequests,
//     checkedValidation,
//     checkedConfirmedEmail,
//
//     async (req: RequestWithBody<{ email: string }>, res: Response) => {
//
//         const result = await authService.resendCode(req.body.email)
//         res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
//     })
// authRouter.post('/refresh-token',
//     checkAndUpdateRefreshToken,
//
//     async (req: Request, res: Response) => {
//         debugger
//         const user = req.user
//         if (user) {
//             debugger
//             const accessToken = await jwtServices.createAccessJWT(user.userId)
//             const refreshToken = await jwtServices.createRefreshJWT(user.deviceId!)
//
//             res.cookie('refreshToken', refreshToken, {httpOnly: false, secure: false}) // local
//             // res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true})
//
//             res.status(HTTP_STATUSES.OK_200).send({accessToken: accessToken})
//         }
//     })
// authRouter.post('/logout',
//     checkAndUpdateRefreshToken,
//
//     async (req: Request, res: Response) => {
//         await securityDevicesService.deleteCurrentSessionById(req.user!.deviceId!)
//         res.cookie('refreshToken', "", {httpOnly: false, secure: false})   // local
//         // res.cookie('refreshToken', "", {httpOnly: true, secure: true})
//         res.send(HTTP_STATUSES.NO_CONTENT_204)
//     })
// authRouter.post('/new-password',
//     authNewPasswordValidation,
//     restrictionRequests,
//     checkedValidation,
//
//     async (req: RequestWithBody<{ newPassword: string, recoveryCode: string }>, res: Response) => {
//         debugger
//         const foundUser = await usersService.findUserByRecoveryCode(req.body.recoveryCode)
//         if (foundUser) {
//             const result = await usersService.updatePassword(req.body.newPassword, req.body.recoveryCode)
//             res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
//         } else {
//             res.status(HTTP_STATUSES.BAD_REQUEST_400).send({
//                 "errorsMessages": [
//                     {
//                         "message": "не валидное поле recoveryCode",
//                         "field": "recoveryCode"
//                     }
//                 ]
//             })
//         }
//
//     })
// authRouter.get('/me',
//     authBearerMiddleware,
//
//     async (req: RequestWithBody<RequestUserViewModel>, res: Response) => {
//         const foundUser = req.user
//         res.send(foundUser)
//     })
