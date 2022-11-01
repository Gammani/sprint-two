import express, {Request, Response} from 'express'
import bodyParser from 'body-parser';
import cors from 'cors'
import {HTTP_STATUSES} from "./utils/utils";
import {bloggers, bloggersRouter} from "./routes/bloggers-router";
import {posts, postsRouter} from "./routes/posts-router";

const app = express()
const port = process.env.PORT || 5000


app.use(bodyParser())
app.use(cors())

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!')
})

// Bloggers
app.use('/bloggers', bloggersRouter)
// Posts
app.use('/posts', postsRouter)

app.delete('/testing/all-data', (req, res) => {
    posts.splice(0, posts.length)
    bloggers.splice(0, bloggers.length)
    res.send(HTTP_STATUSES.NO_CONTENT_204)
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})