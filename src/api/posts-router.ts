import {Response, Router} from "express";
import {
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody, RequestWithParamsAndQuery,
    RequestWithQuery
} from "./inputModels/inputModels";
import {QueryPostsModel} from "../models/QueryPostsModel";
import {PostsWithPaginationViewModel, PostViewModel} from "../models/PostViewModel";
import {HTTP_STATUSES} from "../utils/utils";
import {URIParamsPostIdModel, URIParamsPostIdPostModel} from "./inputModels/URIParamsPostIdModel";
import {CreatePostModel} from "../models/CreatePostModel";
import {UpdatePostModel} from "../models/UpdatePostModel";
import {authBasicMiddleware, authBearerMiddleware} from "../middlewares/auth-middleware";
import {
    checkedValidation,
    commentValidation,
    postValidation
} from "../middlewares/requestValidatorWithExpressValidator";
import {PostsService} from "../application/posts-service";
import {QueryCommentsModel} from "../models/QueryCommentsModel";
import {CommentsWithPaginationViewModel, CommentViewModel} from "./viewModels/CommentViewModel";
import {CommentsService} from "../application/comments-service";
import {RequestCommentWithContent} from "../models/CreateCommentModel";


export const postsRouter = Router({})

class PostsController {
    private postsService: PostsService
    private commentsService: CommentsService

    constructor() {
        this.postsService = new PostsService()
        this.commentsService = new CommentsService()
    }

    async getPosts(req: RequestWithQuery<QueryPostsModel>, res: Response<PostsWithPaginationViewModel>) {
        let foundPosts: PostsWithPaginationViewModel = await this.postsService.findPosts(
            req.query.pageNumber,
            req.query.pageSize,
            req.query.sortBy,
            req.query.sortDirection
        )
        res.send(foundPosts)
    }

    async getPostById(req: RequestWithParams<URIParamsPostIdModel>, res: Response<PostViewModel>) {
        const foundPost: PostViewModel | null = await this.postsService.findPostById(req.params.id)
        if (foundPost) {
            res.send(foundPost)
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }
    }

    async createPostByAdmin(req: RequestWithBody<CreatePostModel>, res: Response<PostViewModel>) {
        // const newPostId: string | null = await postsService.createPost(req.body.title, req.body.shortDescription, req.body.content, req.body.blogId)
        const newPost: PostViewModel | null = await this.postsService.createPost(req.body.title, req.body.shortDescription, req.body.content, req.body.blogId)
        if (newPost) {
            // const newPost: PostViewModel = postQueryRepo.getPostById(newPostId)
            res.status(HTTP_STATUSES.CREATED_201).send(newPost)
        } else {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
        }
    }

    async updatePostByIdByAdmin(req: RequestWithParamsAndBody<URIParamsPostIdModel, UpdatePostModel>, res: Response) {
        const isUpdate: boolean = await this.postsService.updatePost(req.params.id, req.body.title, req.body.shortDescription, req.body.content, req.body.blogId)
        if (isUpdate) {
            const blog = await this.postsService.findPostById(req.params.id)
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }
    }

    async removePostByIdByAdmin(req: RequestWithParams<URIParamsPostIdModel>, res: Response) {
        const isDeletePost: boolean = await this.postsService.deletePost(req.params.id)
        if (isDeletePost) {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }
    }

// Comments from post    !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    async getCommentsByPostId(req: RequestWithParamsAndQuery<URIParamsPostIdPostModel, QueryCommentsModel>, res: Response<CommentsWithPaginationViewModel | any>) {
        const foundPost: PostViewModel | null = await this.postsService.findPostById(req.params.postId!)
        if (foundPost) {
            const foundComments: CommentsWithPaginationViewModel = await this.commentsService.findComments(
                req.query.pageNumber,
                req.query.pageSize,
                req.query.sortBy,
                req.query.sortDirection,
                req.params.postId
            )
            res.send(foundComments)
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }
    }

    async createCommentByPostId(req: RequestWithParamsAndBody<URIParamsPostIdPostModel, RequestCommentWithContent>, res: Response) {
        const foundPost: PostViewModel | null = await this.postsService.findPostById(req.params.postId!)
        if (foundPost) {
            const newComment: CommentViewModel | null = await this.commentsService.createComment(req.body.content, req.user, req.params.postId)
            if (newComment) {
                res.status(HTTP_STATUSES.CREATED_201).send(newComment)
            } else {
                res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
            }
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }
    }
}

const postsController = new PostsController()

postsRouter.get('/', postsController.getPosts.bind(postsController))
postsRouter.get('/:id', postsController.getPostById.bind(postsController))
postsRouter.post('/',
    authBasicMiddleware,
    postValidation,
    checkedValidation,
    postsController.createPostByAdmin.bind(postsController)
)
postsRouter.put('/:id',
    authBasicMiddleware,
    postValidation,
    checkedValidation,
    postsController.updatePostByIdByAdmin.bind(postsController)
)
postsRouter.delete('/:id',
    authBasicMiddleware,
    postsController.removePostByIdByAdmin.bind(postsController)
)
// Comments from post    !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
postsRouter.get('/:postId/comments', postsController.getCommentsByPostId.bind(postsController))
postsRouter.post('/:postId/comments',
    authBearerMiddleware,
    commentValidation,
    checkedValidation,
    postsController.createCommentByPostId.bind(postsController)
)


// postsRouter.get('/', async (req: RequestWithQuery<QueryPostsModel>, res: Response<PostsWithPaginationViewModel>) => {
//     let foundPosts: PostsWithPaginationViewModel = await postsService.findPosts(
//         req.query.pageNumber,
//         req.query.pageSize,
//         req.query.sortBy,
//         req.query.sortDirection
//     )
//     res.send(foundPosts)
// })
// postsRouter.get('/:id', async (req: RequestWithParams<URIParamsPostIdModel>, res: Response<PostViewModel>) => {
//     const foundPost: PostViewModel | null = await postsService.findPostById(req.params.id)
//     if (foundPost) {
//         res.send(foundPost)
//     } else {
//         res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
//     }
// })
// postsRouter.post('/', authBasicMiddleware,
//     postValidation,
//     checkedValidation,
//     async (req: RequestWithBody<CreatePostModel>, res: Response<PostViewModel>) => {
//         // const newPostId: string | null = await postsService.createPost(req.body.title, req.body.shortDescription, req.body.content, req.body.blogId)
//         const newPost: PostViewModel | null = await postsService.createPost(req.body.title, req.body.shortDescription, req.body.content, req.body.blogId)
//         if (newPost) {
//             // const newPost: PostViewModel = postQueryRepo.getPostById(newPostId)
//             res.status(HTTP_STATUSES.CREATED_201).send(newPost)
//         } else {
//             res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
//         }
//     })
// postsRouter.put('/:id', authBasicMiddleware,
//     postValidation,
//     checkedValidation,
//     async (req: RequestWithParamsAndBody<URIParamsPostIdModel, UpdatePostModel>, res: Response) => {
//         const isUpdate: boolean = await postsService.updatePost(req.params.id, req.body.title, req.body.shortDescription, req.body.content, req.body.blogId)
//         if (isUpdate) {
//             const blog = await postsService.findPostById(req.params.id)
//             res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
//         } else {
//             res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
//         }
//     })
// postsRouter.delete('/:id', authBasicMiddleware, async (req: RequestWithParams<URIParamsPostIdModel>, res) => {
//     const isDeletePost: boolean = await postsService.deletePost(req.params.id)
//     if (isDeletePost) {
//         res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
//     } else {
//         res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
//     }
// })
//
// // Comments from post    !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// postsRouter.get('/:postId/comments', async (req: RequestWithParamsAndQuery<URIParamsPostIdPostModel, QueryCommentsModel>, res: Response<CommentsWithPaginationViewModel | any>) => {
//     const foundPost: PostViewModel | null = await postsService.findPostById(req.params.postId!)
//     if (foundPost) {
//         const foundComments: CommentsWithPaginationViewModel = await commentsService.findComments(
//             req.query.pageNumber,
//             req.query.pageSize,
//             req.query.sortBy,
//             req.query.sortDirection,
//             req.params.postId
//         )
//         res.send(foundComments)
//     } else {
//         res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
//     }
//
// })
// postsRouter.post('/:postId/comments',
//     authBearerMiddleware,
//     commentValidation,
//     checkedValidation,
//
//     async (req: RequestWithParamsAndBody<URIParamsPostIdPostModel, RequestCommentWithContent>, res: Response) => {
//
//         const foundPost: PostViewModel | null = await postsService.findPostById(req.params.postId!)
//         if (foundPost) {
//             const newComment: CommentViewModel | null = await commentsService.createComment(req.body.content, req.user, req.params.postId)
//             if (newComment) {
//                 res.status(HTTP_STATUSES.CREATED_201).send(newComment)
//             } else {
//                 res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
//             }
//         } else {
//             res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
//         }
//     })