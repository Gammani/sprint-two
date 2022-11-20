import {Response, Router} from "express";
import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery} from "../utils/types";
import {QueryBloggersModel} from "../models/QueryBloggersModel";
import {BloggerViewModel} from "../models/BloggerViewModel";
import {getBloggerViewModel, HTTP_STATUSES} from "../utils/utils";
import {URIParamsBloggerIdModel} from "../models/URIParamsBloggerIdModel";
import {CreateBloggerModel} from "../models/CreateBloggerModel";
import {UpdateBloggerModel} from "../models/UpdateBloggerModel";
import {authMiddleware} from "../middlewares/auth-middleware";
import {checkedValidation} from "../middlewares/requestValidatorWithExpressValidator";
import {body} from "express-validator";
import {bloggerService} from "../domain/bloggers-service";


export const bloggersRouter = Router({})

bloggersRouter.get('/', async (req: RequestWithQuery<QueryBloggersModel>, res: Response<BloggerViewModel[]>) => {
    const foundBloggers = await bloggerService.findBloggers(req.query.name?.toString())
    res.send(foundBloggers)
})
bloggersRouter.get('/:id', async (req: RequestWithParams<URIParamsBloggerIdModel>, res: Response<BloggerViewModel>) => {
    const foundBlog: BloggerViewModel | null = await bloggerService.findBloggerById(req.params.id)
    if (foundBlog) {
        res.send(getBloggerViewModel(foundBlog))
    } else {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }
})
bloggersRouter.post('/', authMiddleware,
    body('name').isString().trim().isLength({max: 15}).notEmpty(),
    body('description').isString().trim().isLength({max: 500}).notEmpty(),
    body('websiteUrl').isString().trim().isLength({max: 100}).matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/),
    checkedValidation,
    async (req: RequestWithBody<CreateBloggerModel>, res: Response<BloggerViewModel>) => {
    const newBlogger: BloggerViewModel = await bloggerService.creatBlogger(req.body.name,req.body.description, req.body.websiteUrl)
        // const token: any = req.headers.authorization
        res.status(HTTP_STATUSES.CREATED_201).send(newBlogger)
})

bloggersRouter.put('/:id', authMiddleware,
    body('name').isString().trim().isLength({max: 15}).notEmpty(),
    body('description').isString().trim().isLength({max: 500}).notEmpty(),
    body('websiteUrl').isString().trim().isLength({max: 100}).matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/),
    checkedValidation,


    async (req: RequestWithParamsAndBody<URIParamsBloggerIdModel, UpdateBloggerModel>, res) => {
    const isUpdateBlogger: boolean = await bloggerService.updateBlogger(req.params.id, req.body.description, req.body.name, req.body.websiteUrl)
    if (isUpdateBlogger) {
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    } else {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }
})

bloggersRouter.delete('/:id', authMiddleware, async (req: RequestWithParams<URIParamsBloggerIdModel>, res) => {
    const isDeleteBlogger: boolean = await bloggerService.deleteBlogger(req.params.id)
    if (isDeleteBlogger) {
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    } else {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }
})
