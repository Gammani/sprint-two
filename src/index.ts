import express, {Request, Response} from 'express'
import bodyParser from 'body-parser';
import cors from 'cors'
import {BloggersType, PostsType} from "./utils/types";

const app = express()
const port = process.env.PORT || 5000

app.use(bodyParser())
app.use(cors())

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!')
})


const bloggers: BloggersType[] = [
    {
        id: "1",
        name: "Leh",
        youtubeUrl: "https://www.youtube.com/"
    },
    {
        id: "2",
        name: "Kao",
        youtubeUrl: "https://www.youtube.com/"
    },
    {
        id: "3",
        name: "Mint",
        youtubeUrl: "https://www.youtube.com/"
    },
]
const posts: PostsType[] = [
    {
        id: "1",
        title: "string",
        shortDescription: "string",
        content: "string",
        blogId: "1",
        blogName: "string"
    },
    {
        id: "2",
        title: "string",
        shortDescription: "string",
        content: "string",
        blogId: "1",
        blogName: "string"
    },
    {
        id: "3",
        title: "string",
        shortDescription: "string",
        content: "string",
        blogId: "2",
        blogName: "string"
    },
    {
        id: "4",
        title: "string",
        shortDescription: "string",
        content: "string",
        blogId: "2",
        blogName: "string"
    },
    {
        id: "5",
        title: "string",
        shortDescription: "string",
        content: "string",
        blogId: "3",
        blogName: "string"
    },
]


// Bloggers
app.get('/blogs', (req: Request, res: Response) => {
    res.send(bloggers)
})
app.get('/blogs/:id', (req: Request, res: Response) => {
    const foundBlog = bloggers.find(b => b.id === req.params.id)
    if (foundBlog) {
        res.send(foundBlog)
    } else {
        res.send(404)
    }
})
app.post('/blogs', (req: Request, res: Response) => {
    const newBlogger: BloggersType = {
        id: (+new Date()).toString(),
        name: req.body.name,
        youtubeUrl: req.body.youtubeUrl
    }
    bloggers.push(newBlogger)
    res.status(201).send(newBlogger)
})
app.put('/blogs/:id', (req: Request, res: Response) => {
    const foundBlogger = bloggers.find(b => b.id === req.params.id)
    if (foundBlogger) {
        foundBlogger.name = req.body.name
        foundBlogger.youtubeUrl = req.body.youtubeUrl
        res.send(204)
    } else {
        res.send(404)
    }
})
app.delete('/blogs/:id', (req: Request, res: Response) => {
    const foundIndex = bloggers.findIndex(b => b.id === req.params.id)
    if (foundIndex > -1) {
        bloggers.splice(foundIndex, 1)
        res.send(204)
    } else {
        res.send(404)
    }
})

// Posts
app.get('/posts', (req: Request, res: Response) => {
    res.send(posts)
})
app.get('/posts/:id', (req: Request, res: Response) => {
    const foundPost = posts.find(p => p.id === req.params.id)
    if (foundPost) {
        res.send(foundPost)
    } else {
        res.send(404)
    }
})
app.post('/posts', (req: Request, res: Response) => {
    const foundBlogger = bloggers.find(b => b.id === req.body.blogId)
    if (foundBlogger) {
        const newPost = {
            id: (+new Date()).toString(),
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
            blogId: req.body.blogId,
            blogName: foundBlogger.name
        }
        posts.push(newPost)
        res.status(201).send(newPost)
    } else {
        res.status(400).send({
            errorsMessages: [
                {
                    message: "string",
                    field: "string"
                }
            ]
        })
    }
})
app.put('/posts/:id', (req: Request, res: Response) => {
    const foundPost = posts.find(p => p.id === req.params.id)
    if (foundPost) {
        foundPost.title = req.body.title,
            foundPost.shortDescription = req.body.shortDescription,
            foundPost.content = req.body.content,
            foundPost.blogId = req.body.blogId
        res.send(204)
    } else {
        res.send(404)
    }
})
app.delete('/posts/:id', (req: Request, res: Response) => {
    const foundIndex = posts.findIndex(p => p.id === req.params.id)
    if(foundIndex > -1) {
        posts.splice(foundIndex, 1)
        res.send(201)
    } else {
        res.send(404)
    }
})



app.delete('/testing/all-data', (req: Request, res: Response) => {
    posts.splice(0, posts.length)
    bloggers.splice(0, bloggers.length)
    res.send(204)
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})