import {Response, Router} from "express";
import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery} from "../types";
import {QueryBloggersModel} from "../models/QueryBloggersModel";
import {BloggerViewModel} from "../models/BloggerViewModel";
import {getBloggerViewModel, HTTP_STATUSES} from "../utils/utils";
import {URIParamsBloggerIdModel} from "../models/URIParamsBloggerIdModel";
import {CreateBloggerModel} from "../models/CreateBloggerModel";
import {UpdateBloggerModel} from "../models/UpdateBloggerModel";
import {BloggersType} from "../utils/types";


export const bloggers: BloggersType[] = [
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

export const bloggersRouter = Router({})

bloggersRouter.get('/', (req: RequestWithQuery<QueryBloggersModel>, res: Response<BloggerViewModel[]>) => {
    let foundBloggers: BloggerViewModel[] = bloggers
    if (req.query.name) {
        foundBloggers = bloggers.filter(b => b.name.indexOf(req.query.name) > -1)
        res.send(foundBloggers.map(getBloggerViewModel))
    } else {
        res.send(foundBloggers.map(getBloggerViewModel))
    }
})
bloggersRouter.get('/b:id', (req: RequestWithParams<URIParamsBloggerIdModel>, res: Response<BloggerViewModel>) => {
    const foundBlog = bloggers.find(b => b.id === req.params.id)
    if (foundBlog) {
        res.send(getBloggerViewModel(foundBlog))
    } else {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }
})
bloggersRouter.post('/', (req: RequestWithBody<CreateBloggerModel>, res: Response<BloggerViewModel>) => {
    const newBlogger: BloggerViewModel = {
        id: (+new Date()).toString(),
        name: req.body.name,
        youtubeUrl: req.body.youtubeUrl
    }
    bloggers.push(newBlogger)
    res.status(HTTP_STATUSES.CREATED_201).send(newBlogger)
})
bloggersRouter.put('/:id', (req: RequestWithParamsAndBody<URIParamsBloggerIdModel, UpdateBloggerModel>, res) => {
    const foundBlogger: BloggerViewModel | undefined = bloggers.find(b => b.id === req.params.id)
    if (foundBlogger) {
        foundBlogger.name = req.body.name
        foundBlogger.youtubeUrl = req.body.youtubeUrl
        res.send(HTTP_STATUSES.NO_CONTENT_204)
    } else {
        res.send(HTTP_STATUSES.NOT_FOUND_404)
    }
})
bloggersRouter.delete('/b:id', (req: RequestWithParams<URIParamsBloggerIdModel>, res) => {
    const foundIndex = bloggers.findIndex(b => b.id === req.params.id)
    if (foundIndex > -1) {
        bloggers.splice(foundIndex, 1)
        res.send(HTTP_STATUSES.NO_CONTENT_204)
    } else {
        res.send(HTTP_STATUSES.NOT_FOUND_404)
    }
})
