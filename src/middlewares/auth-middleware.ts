import {Request, Response, NextFunction} from "express";
import {Buffer} from "buffer";


export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
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