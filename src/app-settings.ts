import express, {Request, RequestHandler, Response} from 'express'
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import {blogsRouter} from "./routes/blogs-router";
import {postsRouter} from "./routes/posts-router";
import {usersRouter} from "./routes/users-router";
import {authRouter} from "./routes/auth-router";
import {commentsRouter} from "./routes/comments-router";
import {securityDevicesRouter} from "./routes/security-devices-router";
import {addressRouter} from "./routes/address";

export const app = express()

app.use(bodyParser.json())
app.use(cors())
app.use(cookieParser() as RequestHandler)

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