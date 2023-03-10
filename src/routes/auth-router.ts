import {Router, Request, Response} from "express";
import {RequestWithBody, UserType} from "../utils/types";
import {CreateAuthModel} from "../models/CreateAuthModel";
import {body} from "express-validator";
import {checkedValidation} from "../middlewares/requestValidatorWithExpressValidator";
import {usersService} from "../domain/users-service";
import {HTTP_STATUSES} from "../utils/utils";
import {jwtServices} from "../application/jwt-service";
import {MeViewModel} from "../models/MeViewModel";
import {authBasicMiddleware, authBearerMiddleware} from "../middlewares/auth-middleware";
import {UserViewModel} from "../models/UserViewModel";

export const authRouter = Router({})

authRouter.post('/login',
    body('loginOrEmail').isString().trim().notEmpty(),
    body('password').isString().trim().notEmpty(),
    checkedValidation,

    async (req: RequestWithBody<CreateAuthModel>, res) => {
        const user: UserType | null = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)
        if (user) {
            const token = await jwtServices.createJWT(user)
            res.status(HTTP_STATUSES.CREATED_201).send(`accessToken: ${token}`)
        } else {
            res.sendStatus(HTTP_STATUSES.NO_UNAUTHORIZED_401)
        }
    })


authRouter.get('/me',
    authBearerMiddleware,

    async (req: RequestWithBody<UserViewModel>, res: Response) => {
    // console.log(req.body)
        const user = req.body
        res.send(user)
})