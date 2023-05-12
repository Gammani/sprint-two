import {NextFunction, Request, Response} from "express";
import {Buffer} from "buffer";
import {HTTP_STATUSES} from "../utils/utils";
import {jwtServices} from "../application/jwt-service";
import {usersService} from "../domain/users-service";
import {RequestUserViewModel, UserViewModel} from "../models/UserViewModel";
import {UserType} from "../utils/types";

// local?
// export interface userByRequest extends Request {
//     user: UserViewModel | void | null
// }

declare global {
    namespace Express {
        export interface Request {
            user?: RequestUserViewModel | null
        }
    }
}

export const authBasicMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const auth = {login: 'admin', password: 'qwerty'} // change this

    // parse login and password from headers
    const authorization = (req.headers.authorization || '')
    const b64auth = authorization.split(' ')[1] || ''
    const isBasic = authorization.split(' ')[0] === "Basic"
    const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':')

    // Verify login and password are set and correct
    if (isBasic && login && password && login === auth.login && password === auth.password) {
        // Access granted...
        return next()
    }

    // Access denied...
    res.set('WWW-Authenticate', 'Basic realm="401"') // change this
    res.status(401).send('Authentication required.') // custom message
}

export const authBearerMiddleware = async (req: Request, res: Response, next: NextFunction) => {
debugger
    if(!req.headers.authorization) {
        res.send(HTTP_STATUSES.NO_UNAUTHORIZED_401)
        return
    }


    const token = req.headers.authorization.split(' ')[1]

    const userId: any = await jwtServices.getUserIdByToken(token)
    if(userId) {
        debugger
        const foundUser: any = await usersService.findUserById(userId)
        console.log(foundUser)
        req.user = {
            email: foundUser!.accountData.email,
            login: foundUser!.accountData.login,
            userId: foundUser!.accountData.id
        }
        next()
    } else {
        res.send(HTTP_STATUSES.NO_UNAUTHORIZED_401)
    }
}

