import {RequestUserViewModel} from "../api/viewModels/UserViewModel";
import {CommentsWithPaginationViewModel, CommentViewModel} from "../api/viewModels/CommentViewModel";
import {PostViewModel} from "../models/PostViewModel";
import {CommentDBType} from "../utils/types";
import {ObjectId} from "mongodb";
import {CommentsRepository} from "../repositories/comments-mongoose-repository";
import {PostsRepository} from "../repositories/posts-mongoose-repository";

export class CommentsService {
    commentsRepository: CommentsRepository
    postsRepository: PostsRepository

    constructor() {
        this.commentsRepository = new CommentsRepository()
        this.postsRepository = new PostsRepository()
    }
    async findComments(
        pageNumber: string,
        pageSize: string,
        sortBy: string,
        sortDirection: string,
        postId: string
    ): Promise<CommentsWithPaginationViewModel> {
        return await this.commentsRepository.findComments(
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
            postId
        )
    }
    async findCommentById(id: string): Promise<CommentViewModel | null> {
        return await this.commentsRepository.findCommentById(id)
    }
    async createComment(content: string, user: RequestUserViewModel | undefined | null, postId: string): Promise<CommentViewModel | null> {
        const foundPost: PostViewModel | null = await this.postsRepository.findPostById(postId)
        if(foundPost) {
            const createdComment: CommentDBType = {
                _id: new ObjectId,
                content: content,
                commentatorInfo: {
                    userId: user!.userId,
                    userLogin: user!.login
                },
                createdAt: new Date().toISOString(),
                _postId: postId
            }

            return await this.commentsRepository.createComment(createdComment)
        } else {
            return null
        }
    }
    async updateComment(commentId: string, content: string): Promise<boolean> {
        return await this.commentsRepository.updateComment(commentId, content)
    }
    async deleteComment(id: string): Promise<boolean> {
        return await this.commentsRepository.deleteComment(id)
    }
    async deleteAll() {
        return await this.commentsRepository.deleteAll()
    }
}




// export const commentsService = {
//     async findComments(
//         pageNumber: string,
//         pageSize: string,
//         sortBy: string,
//         sortDirection: string,
//         postId: string
//     ): Promise<CommentsWithPaginationViewModel> {
//         return await commentsRepository.findComments(
//             pageNumber,
//             pageSize,
//             sortBy,
//             sortDirection,
//             postId
//         )
//     },
//     async findCommentById(id: string): Promise<CommentViewModel | null> {
//         return await commentsRepository.findCommentById(id)
//     },
//     async createComment(content: string, user: RequestUserViewModel | undefined | null, postId: string): Promise<CommentViewModel | null> {
//         const foundPost: PostViewModel | null = await postsService.findPostById(postId)
//         if(foundPost) {
//             const createdComment: CommentDBType = {
//                 _id: new ObjectId,
//                 content: content,
//                 commentatorInfo: {
//                     userId: user!.userId,
//                     userLogin: user!.login
//                 },
//                 createdAt: new Date().toISOString(),
//                 _postId: postId
//             }
//
//             return await commentsRepository.createComment(createdComment)
//         } else {
//             return null
//         }
//     },
//     async updateComment(commentId: string, content: string): Promise<boolean> {
//         return await commentsRepository.updateComment(commentId, content)
//     },
//     async deleteComment(id: string): Promise<boolean> {
//         return await commentsRepository.deleteComment(id)
//     },
//     async deleteAll() {
//         return await commentsRepository.deleteAll()
//     }
// }