import {Response, Router} from "express";
import {RequestWithBody, UserType} from "../utils/types";
import {CreateAuthModel} from "../models/CreateAuthModel";
import {body} from "express-validator";
import {checkedValidation} from "../middlewares/requestValidatorWithExpressValidator";
import {usersService} from "../domain/users-service";
import {HTTP_STATUSES} from "../utils/utils";
import {jwtServices} from "../application/jwt-service";
import {authBearerMiddleware} from "../middlewares/auth-middleware";
import {RequestUserViewModel, UserViewModel} from "../models/UserViewModel";

export const authRouter = Router({})

authRouter.post('/login',
    body('loginOrEmail').isString().trim().notEmpty(),
    body('password').isString().trim().notEmpty(),
    checkedValidation,

    async (req: RequestWithBody<CreateAuthModel>, res) => {
        const user: UserType | null = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)
        if (user) {
            const token = await jwtServices.createJWT(user)
            res.status(HTTP_STATUSES.OK_200).send(`accessToken: ${token.toString()}`)
        } else {
            res.sendStatus(HTTP_STATUSES.NO_UNAUTHORIZED_401)
        }
    })


authRouter.get('/me',
    authBearerMiddleware,

    async (req: RequestWithBody<RequestUserViewModel>, res: Response) => {
    const foundUser = req.user
        res.send(foundUser)
})