import express, {Request, Response} from "express";
import bodyParser from "body-parser";
import cors from "cors";
import {bloggersRouter} from "./routes/bloggers-router";
import {postsRouter} from "./routes/posts-router";
import {HTTP_STATUSES, removeAllDataBase} from "./utils/utils";
import {usersRouter} from "./routes/users-router";


export const createApp = () => {
    const app = express()
    app.use(bodyParser.json())
    app.use(cors())

    app.get('/', (req: Request, res: Response) => {
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
    return app
}

