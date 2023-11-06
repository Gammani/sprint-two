import {Response, Router} from "express";
import {
    RequestWithBody,
    RequestWithParams, RequestWithParamsAndBody,
    RequestWithParamsAndQuery,
    RequestWithQuery
} from "./inputModels/inputModels";
import {QueryBlogModel, QueryBlogModelWithId} from "../models/QueryBlogModel";
import {BloggerWithPaginationViewModel, BlogViewModel} from "./viewModels/BlogViewModel";
import {HTTP_STATUSES} from "../utils/utils";
import {URIParamsBlogIdModel, URIParamsIdModel} from "./inputModels/URIParamsBlogModel";
import {CreateBlogModel} from "../models/CreateBlogModel";
import {UpdateBlogModel} from "../models/UpdateBlogModel";
import {authBasicMiddleware} from "../middlewares/auth-middleware";
import {
    blogValidation,
    checkedValidation,
    createPostWithoutBlogIdValidation
} from "../middlewares/requestValidatorWithExpressValidator";
import {blogService} from "../application/blogs-service";
import {blogsQueryMongooseRepository} from "../repositories/blogs-query-mongoose-repository";
import {postsService} from "../application/posts-service";
import {PostsWithPaginationViewModel, PostViewModel} from "../models/PostViewModel";
import {CreatePostModelWithBlogId} from "../models/CreatePostModelWithBlogId";


export const blogsRouter = Router({})

class BlogController {
    async getBlogs(req: RequestWithQuery<QueryBlogModel>, res: Response<BloggerWithPaginationViewModel>) {

        if (req.query.searchNameTerm) {
            const foundBloggers: BloggerWithPaginationViewModel = await blogsQueryMongooseRepository.findBloggers(
                req.query.searchNameTerm,
                req.query.pageNumber,
                req.query.pageSize,
                req.query.sortBy,
                req.query.sortDirection
            )
            res.status(HTTP_STATUSES.OK_200).send(foundBloggers)
        } else {
            const foundBlogs: BloggerWithPaginationViewModel = await blogService.findBlogs(
                req.query.pageNumber,
                req.query.pageSize,
                req.query.sortBy,
                req.query.sortDirection
            )
            res.status(HTTP_STATUSES.OK_200).send(foundBlogs)
        }
    }

    async getBlogById(req: RequestWithParams<URIParamsIdModel>, res: Response<BlogViewModel>) {
        const foundBlog: BlogViewModel | null = await blogService.findBlogById(req.params.id)
        if (foundBlog) {
            res.send(foundBlog)
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }
    }

    async getPostsByBlogId(req: RequestWithParamsAndQuery<URIParamsBlogIdModel, QueryBlogModelWithId>, res: Response<PostsWithPaginationViewModel>) {
        const foundBlog: BlogViewModel | null = await blogService.findBlogById(req.params.blogId!)
        if (foundBlog) {
            const foundPosts: PostsWithPaginationViewModel = await postsService.findPosts(
                req.query.pageNumber,
                req.query.pageSize,
                req.query.sortBy,
                req.query.sortDirection,
                req.params.blogId
            )
            res.status(HTTP_STATUSES.OK_200).send(foundPosts)
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }

    }

    async createBlogByAdmin(req: RequestWithBody<CreateBlogModel>, res: Response<BlogViewModel>) {
        const newBlog: BlogViewModel = await blogService.createBlog(req.body.name, req.body.description, req.body.websiteUrl)
        // const token: any = req.headers.authorization
        res.status(HTTP_STATUSES.CREATED_201).send(newBlog)
    }


    async createPostByAdmin(req: RequestWithParamsAndBody<URIParamsBlogIdModel, CreatePostModelWithBlogId>, res: Response<PostViewModel>) {
        const foundBlogger = await blogService.findBlogById(req.params.blogId)
        const newPost: PostViewModel | null = await postsService.createPost(req.body.title, req.body.shortDescription, req.body.content, req.params.blogId)
        if (foundBlogger) {
            if (newPost) {
                res.status(HTTP_STATUSES.CREATED_201).send(newPost)
            } else {
                res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
            }
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }
    }

    async updateBlogByAdmin(req: RequestWithParamsAndBody<URIParamsIdModel, UpdateBlogModel>, res: Response) {
        const isUpdateBlogger: boolean = await blogService.updateBlog(req.params.id, req.body.description, req.body.name, req.body.websiteUrl)
        if (isUpdateBlogger) {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }
    }

    async removeBlogByAdmin(req: RequestWithParams<URIParamsIdModel>, res: Response) {
        const isDeleteBlogger: boolean = await blogService.deleteBlog(req.params.id)
        if (isDeleteBlogger) {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }
    }
}

const blogController = new BlogController()

blogsRouter.get('/', blogController.getBlogs)
blogsRouter.get('/:id', blogController.getBlogById)
blogsRouter.get('/:blogId/posts', blogController.getPostsByBlogId)
blogsRouter.post('/',
    authBasicMiddleware,
    blogValidation,
    checkedValidation,
    blogController.createBlogByAdmin
)
blogsRouter.post('/:blogId/posts',
    authBasicMiddleware,
    createPostWithoutBlogIdValidation,
    checkedValidation,
    blogController.getPostsByBlogId
)
blogsRouter.put('/:id',
    authBasicMiddleware,
    blogValidation,
    checkedValidation,
    blogController.updateBlogByAdmin
)
blogsRouter.delete('/:id',
    authBasicMiddleware,
    blogController.removeBlogByAdmin
)


// blogsRouter.get('/', async (req: RequestWithQuery<QueryBlogModel>, res: Response<BloggerWithPaginationViewModel>) => {
//
//     if (req.query.searchNameTerm) {
//         const foundBloggers: BloggerWithPaginationViewModel = await blogsQueryMongooseRepository.findBloggers(
//             req.query.searchNameTerm,
//             req.query.pageNumber,
//             req.query.pageSize,
//             req.query.sortBy,
//             req.query.sortDirection
//         )
//         res.status(HTTP_STATUSES.OK_200).send(foundBloggers)
//     } else {
//         const foundBlogs: BloggerWithPaginationViewModel = await blogService.findBlogs(
//             req.query.pageNumber,
//             req.query.pageSize,
//             req.query.sortBy,
//             req.query.sortDirection
//         )
//         res.status(HTTP_STATUSES.OK_200).send(foundBlogs)
//     }
// })
// blogsRouter.get('/:id', async (req: RequestWithParams<URIParamsIdModel>, res: Response<BlogViewModel>) => {
//     const foundBlog: BlogViewModel | null = await blogService.findBlogById(req.params.id)
//     if (foundBlog) {
//         res.send(foundBlog)
//     } else {
//         res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
//     }
// })
//
// blogsRouter.get('/:blogId/posts', async (req: RequestWithParamsAndQuery<URIParamsBlogIdModel, QueryBlogModelWithId>, res: Response<PostsWithPaginationViewModel>) => {
//     const foundBlog: BlogViewModel | null = await blogService.findBlogById(req.params.blogId!)
//     if (foundBlog) {
//         const foundPosts: PostsWithPaginationViewModel = await postsService.findPosts(
//             req.query.pageNumber,
//             req.query.pageSize,
//             req.query.sortBy,
//             req.query.sortDirection,
//             req.params.blogId
//         )
//         res.status(HTTP_STATUSES.OK_200).send(foundPosts)
//     } else {
//         res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
//     }
//
// })
// blogsRouter.post('/',
//     authBasicMiddleware,
//     blogValidation,
//     checkedValidation,
//     async (req: RequestWithBody<CreateBlogModel>, res: Response<BlogViewModel>) => {
//         const newBlog: BlogViewModel = await blogService.createBlog(req.body.name, req.body.description, req.body.websiteUrl)
//         // const token: any = req.headers.authorization
//         res.status(HTTP_STATUSES.CREATED_201).send(newBlog)
//     })
//
// blogsRouter.post('/:blogId/posts', authBasicMiddleware,
//     createPostWithoutBlogIdValidation,
//     checkedValidation,
//     async (req: RequestWithParamsAndBody<URIParamsBlogIdModel, CreatePostModelWithBlogId>, res: Response<PostViewModel>) => {
//         const foundBlogger = await blogService.findBlogById(req.params.blogId)
//         const newPost: PostViewModel | null = await postsService.createPost(req.body.title, req.body.shortDescription, req.body.content, req.params.blogId)
//         if (foundBlogger) {
//             if (newPost) {
//                 res.status(HTTP_STATUSES.CREATED_201).send(newPost)
//             } else {
//                 res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
//             }
//         } else {
//             res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
//         }
//     })
//
// blogsRouter.put('/:id', authBasicMiddleware,
//     blogValidation,
//     checkedValidation,
//
//     async (req: RequestWithParamsAndBody<URIParamsIdModel, UpdateBlogModel>, res: Response) => {
//         const isUpdateBlogger: boolean = await blogService.updateBlog(req.params.id, req.body.description, req.body.name, req.body.websiteUrl)
//         if (isUpdateBlogger) {
//             res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
//         } else {
//             res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
//         }
//     })
//
// blogsRouter.delete('/:id', authBasicMiddleware, async (req: RequestWithParams<URIParamsIdModel>, res: Response) => {
//     const isDeleteBlogger: boolean = await blogService.deleteBlog(req.params.id)
//     if (isDeleteBlogger) {
//         res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
//     } else {
//         res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
//     }
// })
