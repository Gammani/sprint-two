import {Response, Router} from "express";
import {
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody,
    RequestWithParamsAndQuery,
    RequestWithQuery
} from "../utils/types";
import {QueryBloggersModel, QueryBloggersModelWithId} from "../models/QueryBloggersModel";
import {BloggerWithPaginationViewModel, BlogViewModel} from "../models/BlogViewModel";
import {HTTP_STATUSES} from "../utils/utils";
import {URIParamsBloggerIdModel, URIParamsBlogIdModel} from "../models/URIParamsBloggerIdModel";
import {CreateBloggerModel} from "../models/CreateBloggerModel";
import {UpdateBloggerModel} from "../models/UpdateBloggerModel";
import {authBasicMiddleware} from "../middlewares/auth-middleware";
import {
    blogValidation,
    checkedValidation,
    createPostWithoutBlogIdValidation
} from "../middlewares/requestValidatorWithExpressValidator";
import {blogService} from "../application/blogs-service";
import {blogsQueryDbRepository} from "../repositories/blogs-query-db-repository";
import {postsService} from "../application/posts-service";
import {PostsWithPaginationViewModel, PostViewModel} from "../models/PostViewModel";
import {CreatePostModelWithBlogId} from "../models/CreatePostModelWithBlogId";


export const blogsRouter = Router({})

blogsRouter.get('/', async (req: RequestWithQuery<QueryBloggersModel>, res: Response<BloggerWithPaginationViewModel>) => {

    if (req.query.searchNameTerm) {
        const foundBloggers: BloggerWithPaginationViewModel = await blogsQueryDbRepository.findBloggers(
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
})
blogsRouter.get('/:id', async (req: RequestWithParams<URIParamsBloggerIdModel>, res: Response<BlogViewModel>) => {
    const foundBlog: BlogViewModel | null = await blogService.findBlogById(req.params.id)
    if (foundBlog) {
        res.send(foundBlog)
    } else {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }
})

blogsRouter.get('/:blogId/posts', async (req: RequestWithParamsAndQuery<URIParamsBlogIdModel, QueryBloggersModelWithId>, res: Response<PostsWithPaginationViewModel>) => {
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

})
blogsRouter.post('/',
    authBasicMiddleware,
    blogValidation,
    checkedValidation,
    async (req: RequestWithBody<CreateBloggerModel>, res: Response<BlogViewModel>) => {
        const newBlog: BlogViewModel = await blogService.createBlog(req.body.name, req.body.description, req.body.websiteUrl)
        // const token: any = req.headers.authorization
        res.status(HTTP_STATUSES.CREATED_201).send(newBlog)
    })

blogsRouter.post('/:blogId/posts', authBasicMiddleware,
    createPostWithoutBlogIdValidation,
    checkedValidation,
    async (req: RequestWithParamsAndBody<URIParamsBlogIdModel, CreatePostModelWithBlogId>, res: Response<PostViewModel>) => {
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
    })

blogsRouter.put('/:id', authBasicMiddleware,
    blogValidation,
    checkedValidation,

    async (req: RequestWithParamsAndBody<URIParamsBloggerIdModel, UpdateBloggerModel>, res: Response) => {
        const isUpdateBlogger: boolean = await blogService.updateBlog(req.params.id, req.body.description, req.body.name, req.body.websiteUrl)
        if (isUpdateBlogger) {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }
    })

blogsRouter.delete('/:id', authBasicMiddleware, async (req: RequestWithParams<URIParamsBloggerIdModel>, res: Response) => {
    const isDeleteBlogger: boolean = await blogService.deleteBlog(req.params.id)
    if (isDeleteBlogger) {
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    } else {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }
})
