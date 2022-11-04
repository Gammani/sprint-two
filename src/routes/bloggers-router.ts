import {Response, Router} from "express";
import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery} from "../types";
import {QueryBloggersModel} from "../models/QueryBloggersModel";
import {BloggerViewModel} from "../models/BloggerViewModel";
import {getBloggerViewModel, HTTP_STATUSES} from "../utils/utils";
import {URIParamsBloggerIdModel} from "../models/URIParamsBloggerIdModel";
import {CreateBloggerModel} from "../models/CreateBloggerModel";
import {UpdateBloggerModel} from "../models/UpdateBloggerModel";
import {bloggersRepository} from "../repositories/bloggers-repository";


export const bloggersRouter = Router({})

bloggersRouter.get('/', (req: RequestWithQuery<QueryBloggersModel>, res: Response<BloggerViewModel[]>) => {
    const foundBloggers = bloggersRepository.findBloggers(req.query.name?.toString())
    res.send(foundBloggers)
})
bloggersRouter.get('/:id', (req: RequestWithParams<URIParamsBloggerIdModel>, res: Response<BloggerViewModel>) => {
    const foundBlog: BloggerViewModel | undefined = bloggersRepository.findBloggerById(req.params.id)
    if (foundBlog) {
        res.send(getBloggerViewModel(foundBlog))
    } else {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }
})
bloggersRouter.post('/', (req: RequestWithBody<CreateBloggerModel>, res: Response<BloggerViewModel>) => {
    const newBlogger: BloggerViewModel = bloggersRepository.creatBlogger(req.body.name,req.body.youtubeUrl)
    res.status(HTTP_STATUSES.CREATED_201).send(newBlogger)
})
bloggersRouter.put('/:id', (req: RequestWithParamsAndBody<URIParamsBloggerIdModel, UpdateBloggerModel>, res) => {
    const isUpdateBlogger: boolean = bloggersRepository.updateBlogger(req.params.id, req.body.name, req.body.youtubeUrl)
    if (isUpdateBlogger) {
        res.send(HTTP_STATUSES.NO_CONTENT_204)
    } else {
        res.send(HTTP_STATUSES.NOT_FOUND_404)
    }
})
bloggersRouter.delete('/:id', (req: RequestWithParams<URIParamsBloggerIdModel>, res) => {
    const isDeleteBlogger: boolean = bloggersRepository.deleteBlogger(req.params.id)
    if (isDeleteBlogger) {
        res.send(HTTP_STATUSES.NO_CONTENT_204)
    } else {
        res.send(HTTP_STATUSES.NOT_FOUND_404)
    }
})
