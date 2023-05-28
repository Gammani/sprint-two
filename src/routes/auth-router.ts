import {Response, Router} from "express";
import {RequestWithBody, UserType} from "../utils/types";
import {CreateAuthModel} from "../models/CreateAuthModel";
import {body} from "express-validator";
import {
    checkedConfirmedEmail,
    checkedExistsForLoginOrEmail,
    checkedValidation
} from "../middlewares/requestValidatorWithExpressValidator";
import {usersService} from "../domain/users-service";
import {HTTP_STATUSES} from "../utils/utils";
import {jwtServices} from "../application/jwt-service";
import {authBearerMiddleware} from "../middlewares/auth-middleware";
import {RequestUserViewModel, UserViewModel} from "../models/UserViewModel";
import {CreateUserModel} from "../models/CreateUserModel";
import {authService} from "../domain/auth-service";

export const authRouter = Router({})

authRouter.post('/login',
    body('loginOrEmail').isString().trim().notEmpty(),
    body('password').isString().trim().notEmpty(),
    checkedValidation,

    async (req: RequestWithBody<CreateAuthModel>, res) => {

        const user: UserType | null = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)
        if (user) {
            const accessToken = await jwtServices.createAccessJWT(user)
            const refreshToken = await jwtServices.createRefreshJWT(user)
            res.status(HTTP_STATUSES.OK_200).send({accessToken: accessToken})
        } else {
            res.sendStatus(HTTP_STATUSES.NO_UNAUTHORIZED_401)
        }
    })

authRouter.post('/registration',
    body('login').isString().trim().isLength({min: 3, max: 10}).notEmpty().matches(/^[a-zA-Z0-9_-]*$/),
    body('password').isString().trim().isLength({min: 6, max: 20}).notEmpty().exists(),
    body('email').isString().trim().notEmpty().matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).exists(),

    checkedValidation,
    checkedExistsForLoginOrEmail,


    async (req: RequestWithBody<CreateUserModel>, res: Response) => {
        const newUser: UserViewModel | null = await usersService.createUser(req.body.login, req.body.email, req.body.password)

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)

        // if(newUser) {
        //     res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        // } else {
        //     res.status(HTTP_STATUSES.BAD_REQUEST_400).send({
        //         "errorsMessages": [
        //             {
        //                 "message": "не валидное поле code",
        //                 "field": "code"
        //             }
        //         ]
        //     })
        // }

    })

authRouter.post('/registration-confirmation',
    body('code').isString().trim().notEmpty(),
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
    checkedValidation,
    checkedConfirmedEmail,

    async (req: RequestWithBody<{ email: string }>, res: Response) => {

        const result = await authService.resendCode(req.body.email)
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    })

authRouter.get('/me',
    authBearerMiddleware,

    async (req: RequestWithBody<RequestUserViewModel>, res: Response) => {
        const foundUser = req.user
        res.send(foundUser)
    })