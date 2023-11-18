import express, {Request, RequestHandler, Response} from 'express'
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import {blogsRouter} from "./api/routes/blogs-router";
import {postsRouter} from "./api/routes/posts-router";
import {usersRouter} from "./api/routes/users-router";
import {authRouter} from "./api/routes/auth-router";
import {commentsRouter} from "./api/routes/comments-router";
import {securityDevicesRouter} from "./api/routes/security-devices-router";
import {addressRouter} from "./api/address";
import {HTTP_STATUSES, removeAllDataBase} from "./utils/utils";


export const app = express()

app.use(bodyParser.json())
app.use(cors())
app.use(cookieParser() as RequestHandler)


// Clear all data

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


app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!!!!!!111')
})