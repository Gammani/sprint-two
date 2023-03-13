import {Request, Response, Router} from "express";
import {
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody,
    RequestWithParamsAndQuery,
    RequestWithQuery
} from "../utils/types";
import {QueryPostsModel} from "../models/QueryPostsModel";
import {PostsWithPaginationViewModel, PostViewModel} from "../models/PostViewModel";
import {HTTP_STATUSES} from "../utils/utils";
import {URIParamsPostIdModel} from "../models/URIParamsPostIdModel";
import {CreatePostModel} from "../models/CreatePostModel";
import {UpdatePostModel} from "../models/UpdatePostModel";
import {authBasicMiddleware} from "../middlewares/auth-middleware";
import {checkedValidation, isValidId} from "../middlewares/requestValidatorWithExpressValidator";
import {body} from "express-validator";
import {postsService} from "../domain/posts-service";
import {QueryCommentsModel} from "../models/QueryCommentsModel";
import {CommentsWithPaginationViewModel} from "../models/CommentViewModel";
import {URIParamsCommentModel} from "../models/URIParamsCommentModel";


export const postsRouter = Router({})


// postsRouter.get('/', async (req: RequestWithQuery<QueryPostsModel>, res: Response<PostViewModel[]>) => {
//     let foundPosts: PostViewModel[] = await postsService.findPosts(req.query.title?.toString())
//     if(req.query.title) {
//         res.send(foundPosts)
//     } else {
//         res.send(foundPosts)
//     }
// })
postsRouter.get('/', async (req: RequestWithQuery<QueryPostsModel>, res: Response<PostsWithPaginationViewModel>) => {
    let foundPosts: PostsWithPaginationViewModel = await postsService.findPosts(
        req.query.pageNumber,
        req.query.pageSize,
        req.query.sortBy,
        req.query.sortDirection
    )
    res.send(foundPosts)
})
postsRouter.get('/:id', async (req: RequestWithParams<URIParamsPostIdModel>, res: Response<PostViewModel>) => {
    const foundPost: PostViewModel | null = await postsService.findPostById(req.params.id)
    if (foundPost) {
        res.send(foundPost)
    } else {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }
})
postsRouter.post('/', authBasicMiddleware,
    body('title').isString().trim().notEmpty().isLength({max: 30}),
    body('shortDescription').isString().trim().notEmpty().isLength({max: 100}),
    body('content').isString().trim().notEmpty().isLength({max: 1000}),
    body('blogId').custom(isValidId),
    checkedValidation,
    async (req: RequestWithBody<CreatePostModel>, res: Response<PostViewModel>) => {
        const newPost: PostViewModel | null = await postsService.createPost(req.body.title, req.body.shortDescription, req.body.content, req.body.blogId)
        if (newPost) {
            res.status(HTTP_STATUSES.CREATED_201).send(newPost)
        } else {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
        }
    })
postsRouter.put('/:id', authBasicMiddleware,
    body('title').isString().trim().notEmpty().isLength({max: 30}),
    body('shortDescription').isString().trim().notEmpty().isLength({max: 100}),
    body('content').isString().trim().notEmpty().isLength({max: 1000}),
    body('blogId').custom(isValidId),
    checkedValidation,
    async (req: RequestWithParamsAndBody<URIParamsPostIdModel, UpdatePostModel>, res) => {
        const isUpdate: boolean = await postsService.updatePost(req.params.id, req.body.title, req.body.shortDescription, req.body.content, req.body.blogId)
        if (isUpdate) {
            const blog = await postsService.findPostById(req.params.id)
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }
    })
postsRouter.delete('/:id', authBasicMiddleware, async (req: RequestWithParams<URIParamsPostIdModel>, res) => {
    const isDeletePost: boolean = await postsService.deletePost(req.params.id)
    if (isDeletePost) {
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    } else {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }
})

// Comments from post    !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
postsRouter.get('/:postId/comments', async (req: RequestWithParamsAndQuery<URIParamsCommentModel, QueryCommentsModel>, res: Response<CommentsWithPaginationViewModel | any>) => {
    const foundPost: PostViewModel | null = await postsService.findPostById(req.params.postId!)
    if(foundPost) {

    }
    // const foundComments: CommentsWithPaginationViewModel = await commentsService.findComments(
    //     req.query.pageNumber,
    //     req.query.pageSize,
    //     req.query.sortBy,
    //     req.query.sortDirection
    // )
    res.send("get all comments from post")
})
postsRouter.post('/:postId/comments', (req: RequestWithParamsAndBody<URIParamsCommentModel, any>, res: Response) => {
    res.send("create new comment in post")
})