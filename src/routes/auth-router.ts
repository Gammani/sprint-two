import {Request, Response, Router} from "express";
import {RequestWithBody, UserType} from "../utils/types";
import {CreateAuthModel} from "../models/CreateAuthModel";
import {body} from "express-validator";
import {checkedValidation} from "../middlewares/requestValidatorWithExpressValidator";
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
            const token = await jwtServices.createJWT(user)
            res.status(HTTP_STATUSES.OK_200).send({accessToken: token})
        } else {
            res.sendStatus(HTTP_STATUSES.NO_UNAUTHORIZED_401)
        }
    })

authRouter.post('/registration',
    body('login').isString().trim().isLength({min: 3, max: 10}).notEmpty().matches(/^[a-zA-Z0-9_-]*$/),
    body('password').isString().trim().isLength({min: 6, max: 20}).notEmpty(),
    body('email').isString().trim().notEmpty().matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/),
    checkedValidation,


    async (req: RequestWithBody<CreateUserModel>, res: Response) => {
        const newUser: UserViewModel | null = await usersService.createUser(req.body.login, req.body.email, req.body.password)
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    })

authRouter.post('/registration-confirmation',
    body('code').isString().trim().notEmpty(),
    checkedValidation,


    async (req: RequestWithBody<{ code: string }>, res: Response) => {

        const result = await authService.confirmEmail(req.body.code)
        if (result) {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        } else {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
        }
    })

authRouter.post('/registration-email-resending', (req: Request, res: Response) => {

})

authRouter.get('/me',
    authBearerMiddleware,

    async (req: RequestWithBody<RequestUserViewModel>, res: Response) => {
        const foundUser = req.user
        res.send(foundUser)
    })