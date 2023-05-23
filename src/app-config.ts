import express, {Request, Response, RequestHandler} from "express";
import bodyParser from "body-parser";
import cors from "cors";
import {bloggersRouter} from "./routes/bloggers-router";
import {postsRouter} from "./routes/posts-router";
import {HTTP_STATUSES, removeAllDataBase} from "./utils/utils";
import {usersRouter} from "./routes/users-router";
import {authRouter} from "./routes/auth-router";
import {commentsRouter} from "./routes/comments-router";
import {addressRouter} from "./routes/address";
import cookieParser from "cookie-parser";


export const createApp = () => {
    const app = express()
    app.use(bodyParser.json())
    app.use(cors())
    app.use(cookieParser() as RequestHandler)





    app.post('/auth/example', (req: Request, res: Response) => {
        res.cookie('cookie_name', 'asd', {httpOnly: true, secure: true})
        res.status(204).send('Hello samurai from it-incubator!!!')
    })
    app.get('/auth/result', async (req: Request, res: Response) => {
        const cookie_name = req.cookies.cookie_name
        res.sendStatus(204)
    })

    // create cookie
    app.post('/', async (req: Request, res: Response) => {
        res.cookie('cookie_name', 'asd', {httpOnly: true, secure: true})
        console.log(res.cookie)
        res.send('Hello World!')
    })
    app.get('/', async (req: Request, res: Response) => {
        const cookie_name= req.cookies.cookie_name
        console.log(req.cookies.cookie_name)
        res.send('Hello World!')
    })


    app.delete('/testing/all-data', async (req: Request, res: Response) => {
        await removeAllDataBase()
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    })

// Bloggers
    app.use('/blogs', bloggersRouter)
// Posts
    app.use('/posts', postsRouter)
// Users
    app.use('/users', usersRouter)
// Auth
    app.use('/auth', authRouter)
// Comments
    app.use('/comments', commentsRouter)
    //know my IP
    app.use('/address', addressRouter)
    return app
}

