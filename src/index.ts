import express, {Request, Response} from 'express'
import bodyParser from 'body-parser';
import cors from 'cors'
import {HTTP_STATUSES} from "./utils/utils";
import {bloggersRouter} from "./routes/bloggers-router";
import {postsRouter} from "./routes/posts-router";
import {bloggers} from "./repositories/bloggers-in-memory-repository";
import {posts} from "./repositories/posts-in-memory-repository";
import {removeAllDataBase} from "./repositories/db";

export const app = express()
const port = process.env.PORT || 5000


app.use(bodyParser.json())
app.use(cors())

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!')
})

// Bloggers
app.use('/blogs', bloggersRouter)
// Posts
app.use('/posts', postsRouter)

app.delete('/testing/all-data', async (req, res) => {
    // posts.splice(0, posts.length)
    // bloggers.splice(0, bloggers.length)
    await removeAllDataBase()
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
