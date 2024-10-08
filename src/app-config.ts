import express, {Request, Response, RequestHandler} from "express";
import bodyParser from "body-parser";
import cors from "cors";
import {blogsRouter} from "./api/routes/blogs-router";
import {postsRouter} from "./api/routes/posts-router";
import {HTTP_STATUSES, removeAllDataBase} from "./utils/utils";
import {usersRouter} from "./api/routes/users-router";
import {authRouter} from "./api/routes/auth-router";
import {commentsRouter} from "./api/routes/comments-router";
import {addressRouter} from "./api/address";
import cookieParser from "cookie-parser";
import {requestsCounter} from "./middlewares/requestsCounter";
import {securityDevicesRouter} from "./api/routes/security-devices-router";


export const createApp = () => {
    const app = express()
    app.use(bodyParser.json())
    app.use(cors())
    app.use(cookieParser() as RequestHandler)




    // create cookie
    app.post('/',
        requestsCounter,

        async (req: Request, res: Response) => {
        res.cookie('cookie_name', 'test', {httpOnly: true, secure: true})
        res.send('Hello World!')
    })
    app.get('/', requestsCounter, async (req: Request, res: Response) => {
        const cookie_name = req.cookies.cookie_name
        console.log(req.cookies.cookie_name)
        res.status(200).json('Hello World!').end()
    })


    app.delete('/testing/all-data', async (req: Request, res: Response) => {
        await removeAllDataBase()
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    })

// Bloggers
    app.use('/blogs', blogsRouter)
// Posts
    app.use('/posts', postsRouter)
// Users
    app.use('/users', usersRouter)
// Auth
    app.use('/auth', authRouter)
// Comments
    app.use('/comments', commentsRouter)
// SecurityDevices
    app.use('/security/devices', securityDevicesRouter)
    //know my IP
    app.use('/address', addressRouter)
    return app
}
//
