import {UsersService} from "../../application/users-service";
import {JwtService} from "../../application/jwt-service";
import {AuthService} from "../../application/auth-service";
import {SecurityDevicesService} from "../../application/sequrity-devices-service";
import {RequestWithBody} from "../inputModels/inputModels";
import {CreateAuthModel} from "../../models/CreateAuthModel";
import {Request, Response} from "express";
import {UserTypeDbModel} from "../../utils/types";
import {DeviceViewModel} from "../viewModels/DeviceViewModel";
import {HTTP_STATUSES} from "../../utils/utils";
import {CreateUserModel} from "../../models/CreateUserModel";
import {RequestUserViewModel, UserViewModel} from "../viewModels/UserViewModel";

export class AuthController {
    constructor(protected usersService: UsersService,
                protected jwtServices: JwtService,
                protected authService: AuthService,
                protected securityDevicesService: SecurityDevicesService) {
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