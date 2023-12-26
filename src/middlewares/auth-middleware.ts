import {NextFunction, Request, Response} from "express";
import {Buffer} from "buffer";
import {HTTP_STATUSES} from "../utils/utils";
import {JwtService} from "../application/jwt-service";
import {UsersService} from "../application/users-service";
import {RequestUserViewModel} from "../api/viewModels/UserViewModel";
import {container} from "../composition-root";
import {ExpiredTokenRepository} from "../repositories/expiredToken-mongoose-repository";
import {DevicesRepository} from "../repositories/devices-mongoose-repository";
import {UsersRepository} from "../repositories/users-mongoose-repository";
//import {jwtService, usersService} from "../composition-root";

// local?
// export interface userByRequest extends Request {
//     user: UserViewModel | void | null
// }

declare global {
    namespace Express {
        export interface Request {
            user: RequestUserViewModel | null
        }
    }
}
const jwtService =/* container.resolve(JwtService)*/ new JwtService(new ExpiredTokenRepository(), new DevicesRepository())
const usersService = /*container.resolve(UsersService)*/ new UsersService(new UsersRepository(), new DevicesRepository())


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

debugger
    const token = req.headers.authorization.split(' ')[1]
debugger
    const user: any = await jwtService.getUserIdByAccessToken(token)
    debugger
    if(user) {
        debugger
        const foundUser: any = await usersService.findUserById(user.userId)
        debugger
        req.user = {
            email: foundUser!.accountData.email,
            login: foundUser!.accountData.login,
            userId: foundUser!._id.toString()
        }
        next()
    } else {
        res.send(HTTP_STATUSES.NO_UNAUTHORIZED_401)
    }
}
export const isTokenInsideHeader = async (req: Request, res: Response, next: NextFunction) => {
    if(req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1]
        const user: any = await jwtService.getUserIdByAccessToken(token)
        if(user) {
            const foundUser: any = await usersService.findUserById(user.userId)
            req.user = {
                email: foundUser!.accountData.email,
                login: foundUser!.accountData.login,
                userId: foundUser!._id.toString()
            }
            next()
        } else {
            next()
        }
    } else {
        next()
    }
}
// export const isTokenInsidePostHeader = async (req: Request, res: Response, next: NextFunction) => {
//     if(req.headers.authorization) {
//         const token = req.headers.authorization.split(' ')[1]
//         const user: any = await jwtService.getUserIdByAccessToken(token)
//         if(user) {
//             console.log('user in payload',user)
//             const foundUser: any = await usersService.findUserById(user.userId)
//             console.log('user in db', foundUser)
//             req.user = {
//                 email: foundUser!.accountData.email,
//                 login: foundUser!.accountData.login,
//                 userId: foundUser!._id.toString()
//             }
//             next()
//         } else {
//             next()
//         }
//     } else {
//         next()
//     }
// }

