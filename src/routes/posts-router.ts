import {Response, Router} from "express";
import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery} from "../types";
import {QueryPostsModel} from "../models/QueryPostsModel";
import {PostViewModel} from "../models/PostViewModel";
import {getPostsViewModel, HTTP_STATUSES} from "../utils/utils";
import {URIParamsPostIdModel} from "../models/URIParamsPostIdModel";
import {CreatePostModel} from "../models/CreatePostModel";
import {BloggerViewModel} from "../models/BloggerViewModel";
import {UpdatePostModel} from "../models/UpdatePostModel";
import {PostsType} from "../utils/types";
import {bloggers} from "./bloggers-router";


export const posts: PostsType[] = [
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

export const postsRouter = Router({})

postsRouter.get('/posts', (req: RequestWithQuery<QueryPostsModel>, res: Response<PostViewModel[]>) => {
    let foundPosts: PostViewModel[] = posts
    if(req.query.title) {
        foundPosts = posts.filter(p => p.title.indexOf(req.query.title) > -1)
        res.send(foundPosts.map(getPostsViewModel))
    } else {
        res.send(foundPosts.map(getPostsViewModel))
    }
})
postsRouter.get('/posts/:id', (req: RequestWithParams<URIParamsPostIdModel>, res: Response<PostViewModel>) => {
    const foundPost = posts.find(p => p.id === req.params.id)
    if (foundPost) {
        res.send(getPostsViewModel(foundPost))
    } else {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }
})
postsRouter.post('/posts', (req: RequestWithBody<CreatePostModel>, res: Response<PostViewModel>) => {
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
postsRouter.put('/posts/:id', (req: RequestWithParamsAndBody<URIParamsPostIdModel, UpdatePostModel>, res) => {
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
postsRouter.delete('/posts/:id', (req: RequestWithParams<URIParamsPostIdModel>, res) => {
    const foundIndex = posts.findIndex(p => p.id === req.params.id)
    if (foundIndex > -1) {
        posts.splice(foundIndex, 1)
        res.send(HTTP_STATUSES.CREATED_201)
    } else {
        res.send(HTTP_STATUSES.NOT_FOUND_404)
    }
})