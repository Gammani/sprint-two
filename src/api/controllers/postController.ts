import {PostsService} from "../../application/posts-service";
import {CommentsService} from "../../application/comments-service";
import {
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody,
    RequestWithParamsAndQuery,
    RequestWithQuery
} from "../inputModels/inputModels";
import {QueryPostsModel} from "../../models/QueryPostsModel";
import {Response} from "express";
import {PostsWithPaginationViewModel, PostViewModel} from "../../models/PostViewModel";
import {URIParamsPostIdModel, URIParamsPostIdPostModel} from "../inputModels/URIParamsPostIdModel";
import {HTTP_STATUSES} from "../../utils/utils";
import {CreatePostModel} from "../../models/CreatePostModel";
import {UpdatePostModel} from "../../models/UpdatePostModel";
import {QueryCommentsModel} from "../../models/QueryCommentsModel";
import {CommentsWithPaginationViewModel, CommentViewModel} from "../viewModels/CommentViewModel";
import {RequestCommentWithContent} from "../../models/CreateCommentModel";
import {CommentDBType, PostDbType} from "../../utils/types";
import {PostsQueryRepository} from "../../repositories/posts-query-mongoose-repository";
import {CommentsQueryRepository} from "../../repositories/comments-query-repository";

export class PostsController {
    constructor(protected postsService: PostsService,
                protected commentsService: CommentsService,
                protected postsQueryRepository: PostsQueryRepository,
                protected commentsQueryRepository: CommentsQueryRepository) {
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
        const foundPost: PostViewModel | null = await this.postsQueryRepository.findPostById(req.params.id)
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
//     async getCommentsByPostId(req: RequestWithParamsAndQuery<URIParamsPostIdPostModel, QueryCommentsModel>, res: Response<CommentsWithPaginationViewModel | any>) {
//         const foundPost: PostDbType | null = await this.postsService.findPostById(req.params.postId!)
//         if (foundPost) {
//             if(req.user) {
//                 const foundCommentsWithUser: CommentsWithPaginationViewModel = await this.commentsService.findComments(
//                     req.query.pageNumber,
//                     req.query.pageSize,
//                     req.query.sortBy,
//                     req.query.sortDirection,
//                     req.params.postId
//                 )
//                 res.send(foundComments)
//             } else {
//                 const foundCommentsWithUserNoName: CommentsWithPaginationViewModel = await this.commentsService.findComments(
//                     req.query.pageNumber,
//                     req.query.pageSize,
//                     req.query.sortBy,
//                     req.query.sortDirection,
//                     req.params.postId
//                 )
//                 res.send(foundCommentsWithUserNoName)
//             }
//         } else {
//             res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
//         }
//     }

    async getCommentsByPostId(req: RequestWithParamsAndQuery<URIParamsPostIdPostModel, QueryCommentsModel>, res: Response<CommentsWithPaginationViewModel | any>) {
        const foundPost: PostDbType | null = await this.postsService.findPostById(req.params.postId!)
        if (foundPost) {
            if(req.user) {
                const foundCommentsWithUser: CommentsWithPaginationViewModel = await this.commentsQueryRepository.findComments(
                    req.query.pageNumber,
                    req.query.pageSize,
                    req.query.sortBy,
                    req.query.sortDirection,
                    req.params.postId,
                    req.user.userId
                )
                res.send(foundCommentsWithUser)
            } else {
                const foundCommentsWithUserNoName: CommentsWithPaginationViewModel = await this.commentsQueryRepository.findComments(
                    req.query.pageNumber,
                    req.query.pageSize,
                    req.query.sortBy,
                    req.query.sortDirection,
                    req.params.postId
                )
                res.send(foundCommentsWithUserNoName)
            }
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }
    }

    async createCommentByPostId(req: RequestWithParamsAndBody<URIParamsPostIdPostModel, RequestCommentWithContent>, res: Response) {
        const foundPost: PostDbType | null = await this.postsService.findPostById(req.params.postId!)
        if (foundPost) {
            const newComment: CommentDBType | null = await this.commentsService.createComment(req.body.content, req.user, req.params.postId)
            if (newComment) {
                const foundComment: CommentViewModel | null = await this.commentsQueryRepository.findCommentById(newComment._id.toString())
                res.status(HTTP_STATUSES.CREATED_201).send(foundComment)
            } else {
                res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
            }
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }
    }
}