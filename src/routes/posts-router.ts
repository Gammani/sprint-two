import {Response, Router} from "express";
import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery} from "../utils/types";
import {QueryPostsModel} from "../models/QueryPostsModel";
import {PostViewModel} from "../models/PostViewModel";
import {HTTP_STATUSES} from "../utils/utils";
import {URIParamsPostIdModel} from "../models/URIParamsPostIdModel";
import {CreatePostModel} from "../models/CreatePostModel";
import {UpdatePostModel} from "../models/UpdatePostModel";
import {postsInMemoryRepository} from "../repositories/posts-in-memory-repository";
import {authMiddleware} from "../middlewares/auth-middleware";
import {checkedValidation, isValidId} from "../middlewares/requestValidatorWithExpressValidator";
import {body} from "express-validator";


export const postsRouter = Router({})


postsRouter.get('/', async (req: RequestWithQuery<QueryPostsModel>, res: Response<PostViewModel[]>) => {
    let foundPosts: PostViewModel[] = await postsInMemoryRepository.findPosts(req.query.title?.toString())
    if(req.query.title) {

        res.send(foundPosts)
    } else {
        res.send(foundPosts)
    }
})
postsRouter.get('/:id', async (req: RequestWithParams<URIParamsPostIdModel>, res: Response<PostViewModel>) => {
    const foundPost: PostViewModel | undefined = await postsInMemoryRepository.findPostById(req.params.id)
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
    body('blogId').custom(isValidId),
    checkedValidation,
    async (req: RequestWithBody<CreatePostModel>, res: Response<PostViewModel>) => {
    const newPost: PostViewModel | undefined = await postsInMemoryRepository.createPost(req.body.title, req.body.shortDescription, req.body.content, req.body.blogId)
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
    body('blogId').custom(isValidId),
    checkedValidation,
    async (req: RequestWithParamsAndBody<URIParamsPostIdModel, UpdatePostModel>, res) => {
    const isUpdatePost: boolean = await postsInMemoryRepository.updatePost(req.params.id, req.body.title, req.body.shortDescription, req.body.content, req.body.blogId)
    if (isUpdatePost) {
        res.send(HTTP_STATUSES.NO_CONTENT_204)
    } else {
        res.send(HTTP_STATUSES.NOT_FOUND_404)
    }
})

postsRouter.delete('/:id', authMiddleware, async (req: RequestWithParams<URIParamsPostIdModel>, res) => {
    const isDeletePost: boolean = await postsInMemoryRepository.deletePost(req.params.id)
    if (isDeletePost) {
        res.send(HTTP_STATUSES.NO_CONTENT_204)
    } else {
        res.send(HTTP_STATUSES.NOT_FOUND_404)
    }
})