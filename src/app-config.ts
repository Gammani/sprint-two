import express, {Request, Response} from "express";
import bodyParser from "body-parser";
import cors from "cors";
import {bloggersRouter} from "./routes/bloggers-router";
import {postsRouter} from "./routes/posts-router";
import {HTTP_STATUSES, removeAllDataBase} from "./utils/utils";


export const createApp = () => {
    const app = express()
    app.use(bodyParser.json())
    app.use(cors())

    app.get('/', (req: Request, res: Response) => {
        res.send('Hello World!')
    })

    app.delete('/testing/all-data', async (req: Request, res: Response) => {
        // posts.splice(0, posts.length)
        // bloggers.splice(0, bloggers.length)
        await removeAllDataBase()
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    })

// Bloggers
    app.use('/blogs', bloggersRouter)
// Posts
    app.use('/posts', postsRouter)
    return app
}

