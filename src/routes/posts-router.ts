import {Response, Router} from "express";
import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery} from "../utils/types";
import {QueryPostsModel} from "../models/QueryPostsModel";
import {PostViewModel} from "../models/PostViewModel";
import {HTTP_STATUSES} from "../utils/utils";
import {URIParamsPostIdModel} from "../models/URIParamsPostIdModel";
import {CreatePostModel} from "../models/CreatePostModel";
import {UpdatePostModel} from "../models/UpdatePostModel";
import {postsRepository} from "../repositories/posts-repository";
import {authMiddleware} from "../middlewares/auth-middleware";
import {checkedValidation, isValidId} from "../middlewares/requestValidatorWithExpressValidator";
import {body, CustomValidator} from "express-validator";



export const postsRouter = Router({})


postsRouter.get('/', (req: RequestWithQuery<QueryPostsModel>, res: Response<PostViewModel[]>) => {
    let foundPosts: PostViewModel[] = postsRepository.findPosts(req.query.title?.toString())
    if(req.query.title) {

        res.send(foundPosts)
    } else {
        res.send(foundPosts)
    }
})
postsRouter.get('/:id', (req: RequestWithParams<URIParamsPostIdModel>, res: Response<PostViewModel>) => {
    const foundPost: PostViewModel | undefined = postsRepository.findPostById(req.params.id)
    if (foundPost) {
        res.send(foundPost)
    } else {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }
})
postsRouter.post('/', authMiddleware,
    body('title').isString().trim().notEmpty().isLength({max: 30}),
    body('shortDescription').isString().trim().notEmpty().isLength({max: 100}),
    body('content').isString().trim().notEmpty().isLength({max: 1000}),
    body('blogId').custom(isValidId).isString().trim().notEmpty(),
    checkedValidation,
    (req: RequestWithBody<CreatePostModel>, res: Response<PostViewModel>) => {
    const newPost: PostViewModel | undefined = postsRepository.creatPost(req.body.title, req.body.shortDescription, req.body.content, req.body.blogId)
    if (newPost) {
        res.status(HTTP_STATUSES.CREATED_201).send(newPost)
    } else {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
    }
})

postsRouter.put('/:id', authMiddleware,
    body('title').isString().trim().notEmpty().isLength({max: 30}),
    body('shortDescription').isString().trim().notEmpty().isLength({max: 100}),
    body('content').isString().trim().notEmpty().isLength({max: 1000}),
    body('blogId').custom(isValidId).isString().trim().notEmpty(),
    checkedValidation,
    (req: RequestWithParamsAndBody<URIParamsPostIdModel, UpdatePostModel>, res) => {
    const isUpdatePost: boolean = postsRepository.updatePost(req.params.id, req.body.title, req.body.shortDescription, req.body.content, req.body.blogId)
    if (isUpdatePost) {
        res.send(HTTP_STATUSES.NO_CONTENT_204)
    } else {
        res.send(HTTP_STATUSES.NOT_FOUND_404)
    }
})

postsRouter.delete('/:id', authMiddleware, (req: RequestWithParams<URIParamsPostIdModel>, res) => {
    const isDeletePost: boolean = postsRepository.deletePost(req.params.id)
    if (isDeletePost) {
        res.send(HTTP_STATUSES.NO_CONTENT_204)
    } else {
        res.send(HTTP_STATUSES.NOT_FOUND_404)
    }
})