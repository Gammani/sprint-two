import {Response, Router} from "express";
import {BlogsQueryRepository} from "../../repositories/blogs-query-repository";
import {BlogsService} from "../../application/blogs-service";
import {PostsService} from "../../application/posts-service";
import {
    RequestWithBody,
    RequestWithParams, RequestWithParamsAndBody,
    RequestWithParamsAndQuery,
    RequestWithQuery
} from "../inputModels/inputModels";
import {QueryBlogModel, QueryBlogModelWithId} from "../../models/QueryBlogModel";
import {BloggerWithPaginationViewModel, BlogViewModel} from "../viewModels/BlogViewModel";
import {HTTP_STATUSES} from "../../utils/utils";
import {URIParamsBlogIdModel, URIParamsIdModel} from "../inputModels/URIParamsBlogModel";
import {PostsWithPaginationViewModel, PostViewModel} from "../../models/PostViewModel";
import {CreateBlogModel} from "../../models/CreateBlogModel";
import {CreatePostModelWithBlogId} from "../../models/CreatePostModelWithBlogId";
import {UpdateBlogModel} from "../../models/UpdateBlogModel";
import {inject, injectable} from "inversify";


@injectable()
export class BlogController {
    constructor(
        @inject(BlogsQueryRepository) protected blogsQueryRepository: BlogsQueryRepository,
        @inject(BlogsService) protected blogService: BlogsService,
        @inject(PostsService) protected postsService: PostsService
    ) {
    }

    async getBlogs(req: RequestWithQuery<QueryBlogModel>, res: Response<BloggerWithPaginationViewModel>) {

        if (req.query.searchNameTerm) {
            const foundBloggers: BloggerWithPaginationViewModel = await this.blogsQueryRepository.findBloggers(
                req.query.searchNameTerm,
                req.query.pageNumber,
                req.query.pageSize,
                req.query.sortBy,
                req.query.sortDirection
            )
            res.status(HTTP_STATUSES.OK_200).send(foundBloggers)
        } else {
            const foundBlogs: BloggerWithPaginationViewModel = await this.blogService.findBlogs(
                req.query.pageNumber,
                req.query.pageSize,
                req.query.sortBy,
                req.query.sortDirection
            )
            res.status(HTTP_STATUSES.OK_200).send(foundBlogs)
        }
    }

    async getBlogById(req: RequestWithParams<URIParamsIdModel>, res: Response<BlogViewModel>) {
        const foundBlog: BlogViewModel | null = await this.blogService.findBlogById(req.params.id)
        if (foundBlog) {
            res.send(foundBlog)
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }
    }

    async getPostsByBlogId(req: RequestWithParamsAndQuery<URIParamsBlogIdModel, QueryBlogModelWithId>, res: Response<PostsWithPaginationViewModel>) {
        const foundBlog: BlogViewModel | null = await this.blogService.findBlogById(req.params.blogId!)
        if (foundBlog) {
            const foundPosts: PostsWithPaginationViewModel = await this.postsService.findPosts(
                req.query.pageNumber,
                req.query.pageSize,
                req.query.sortBy,
                req.query.sortDirection,
                req.user?.userId,
                req.params.blogId
            )
            res.status(HTTP_STATUSES.OK_200).send(foundPosts)
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }

    }

    async createBlogByAdmin(req: RequestWithBody<CreateBlogModel>, res: Response<BlogViewModel>) {
        const newBlog: BlogViewModel = await this.blogService.createBlog(req.body.name, req.body.description, req.body.websiteUrl)
        // const token: any = req.headers.authorization
        res.status(HTTP_STATUSES.CREATED_201).send(newBlog)
    }


    async createPostByAdmin(req: RequestWithParamsAndBody<URIParamsBlogIdModel, CreatePostModelWithBlogId>, res: Response<PostViewModel>) {
        const foundBlogger = await this.blogService.findBlogById(req.params.blogId)
        const newPost: PostViewModel | null = await this.postsService.createPost(req.body.title, req.body.shortDescription, req.body.content, req.params.blogId)
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
        const isUpdateBlogger: boolean = await this.blogService.updateBlog(req.params.id, req.body.description, req.body.name, req.body.websiteUrl)
        if (isUpdateBlogger) {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }
    }

    async removeBlogByAdmin(req: RequestWithParams<URIParamsIdModel>, res: Response) {
        const isDeleteBlogger: boolean = await this.blogService.deleteBlog(req.params.id)
        if (isDeleteBlogger) {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }
    }
}