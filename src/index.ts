import express, {Request, Response} from 'express'
import bodyParser from 'body-parser';
import cors from 'cors'
import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery} from "./types";
import {CreateBloggerModel} from "./models/CreateBloggerModel";
import {UpdateBloggerModel} from "./models/UpdateBloggerModel";
import {QueryBloggersModel} from "./models/QueryBloggersModel";
import {BloggerViewModel} from "./models/BloggerViewModel";
import {PostViewModel} from "./models/PostViewModel";
import {BloggersType, PostsType} from "./utils/types";
import {URIParamsBloggerIdModel} from "./models/URIParamsBloggerIdModel";
import {QueryPostsModel} from "./models/QueryPostsModel";
import {getBloggerViewModel, getPostsViewModel, HTTP_STATUSES} from "./utils/utils";
import {URIParamsPostIdModel} from "./models/URIParamsPostIdModel";
import {CreatePostModel} from "./models/CreatePostModel";
import {UpdatePostModel} from "./models/UpdatePostModel";

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
app.get('/blogs', (req: RequestWithQuery<QueryBloggersModel>, res: Response<BloggerViewModel[]>) => {
    let foundBloggers: BloggerViewModel[] = bloggers
    if (req.query.name) {
        foundBloggers = bloggers.filter(b => b.name.indexOf(req.query.name) > -1)
        res.send(foundBloggers.map(getBloggerViewModel))
    } else {
        res.send(foundBloggers.map(getBloggerViewModel))
    }
})
app.get('/blogs/:id', (req: RequestWithParams<URIParamsBloggerIdModel>, res: Response<BloggerViewModel>) => {
    const foundBlog = bloggers.find(b => b.id === req.params.id)
    if (foundBlog) {
        res.send(getBloggerViewModel(foundBlog))
    } else {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }
})
app.post('/blogs', (req: RequestWithBody<CreateBloggerModel>, res: Response<BloggerViewModel>) => {
    const newBlogger: BloggerViewModel = {
        id: (+new Date()).toString(),
        name: req.body.name,
        youtubeUrl: req.body.youtubeUrl
    }
    bloggers.push(newBlogger)
    res.status(HTTP_STATUSES.CREATED_201).send(newBlogger)
})
app.put('/blogs/:id', (req: RequestWithParamsAndBody<URIParamsBloggerIdModel, UpdateBloggerModel>, res) => {
    const foundBlogger: BloggerViewModel | undefined = bloggers.find(b => b.id === req.params.id)
    if (foundBlogger) {
        foundBlogger.name = req.body.name
        foundBlogger.youtubeUrl = req.body.youtubeUrl
        res.send(HTTP_STATUSES.NO_CONTENT_204)
    } else {
        res.send(HTTP_STATUSES.NOT_FOUND_404)
    }
})
app.delete('/blogs/:id', (req: RequestWithParams<URIParamsBloggerIdModel>, res) => {
    const foundIndex = bloggers.findIndex(b => b.id === req.params.id)
    if (foundIndex > -1) {
        bloggers.splice(foundIndex, 1)
        res.send(HTTP_STATUSES.NO_CONTENT_204)
    } else {
        res.send(HTTP_STATUSES.NOT_FOUND_404)
    }
})


// Posts
app.get('/posts', (req: RequestWithQuery<QueryPostsModel>, res: Response<PostViewModel[]>) => {
    let foundPosts: PostViewModel[] = posts
    if(req.query.title) {
        foundPosts = posts.filter(p => p.title.indexOf(req.query.title) > -1)
        res.send(foundPosts.map(getPostsViewModel))
    } else {
        res.send(foundPosts.map(getPostsViewModel))
    }
})
app.get('/posts/:id', (req: RequestWithParams<URIParamsPostIdModel>, res: Response<PostViewModel>) => {
    const foundPost = posts.find(p => p.id === req.params.id)
    if (foundPost) {
        res.send(getPostsViewModel(foundPost))
    } else {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }
})
app.post('/posts', (req: RequestWithBody<CreatePostModel>, res: Response<PostViewModel>) => {
    const foundBlogger: BloggerViewModel | undefined = bloggers.find(b => b.id === req.body.blogId)
    if (foundBlogger) {
        const newPost: PostViewModel = {
            id: (+new Date()).toString(),
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
            blogId: req.body.blogId,
            blogName: foundBlogger.name
        }
        posts.push(newPost)
        res.status(HTTP_STATUSES.CREATED_201).send(newPost)
    } else {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
    }
})
app.put('/posts/:id', (req: RequestWithParamsAndBody<URIParamsPostIdModel, UpdatePostModel>, res) => {
    const foundPost: PostViewModel | undefined = posts.find(p => p.id === req.params.id)
    if (foundPost) {
        foundPost.title = req.body.title,
            foundPost.shortDescription = req.body.shortDescription,
            foundPost.content = req.body.content,
            foundPost.blogId = req.body.blogId
        res.send(HTTP_STATUSES.NO_CONTENT_204)
    } else {
        res.send(HTTP_STATUSES.NOT_FOUND_404)
    }
})
app.delete('/posts/:id', (req: RequestWithParams<URIParamsPostIdModel>, res) => {
    const foundIndex = posts.findIndex(p => p.id === req.params.id)
    if (foundIndex > -1) {
        posts.splice(foundIndex, 1)
        res.send(HTTP_STATUSES.CREATED_201)
    } else {
        res.send(HTTP_STATUSES.NOT_FOUND_404)
    }
})


app.delete('/testing/all-data', (req, res) => {
    posts.splice(0, posts.length)
    bloggers.splice(0, bloggers.length)
    res.send(HTTP_STATUSES.NO_CONTENT_204)
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})