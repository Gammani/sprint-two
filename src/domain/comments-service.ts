import {RequestUserViewModel} from "../models/UserViewModel";
import {CommentsWithPaginationViewModel, CommentViewModel} from "../models/CommentViewModel";
import {commentsRepository} from "../repositories/comments-db-repository";
import {commentsCollection, postsCollection} from "../repositories/db";

export const commentsService = {
    async findComments(
        pageNumber: string,
        pageSize: string,
        sortBy: string,
        sortDirection: string
    ): Promise<CommentsWithPaginationViewModel> {
        return await commentsRepository.findComments(
            pageNumber,
            pageSize,
            sortBy,
            sortDirection
        )
    },
    async findCommentById(id: string): Promise<CommentViewModel | null> {
        return await commentsRepository.findCommentById(id)
    },
    async createComment(content: string, user: RequestUserViewModel | undefined | null): Promise<CommentViewModel> {
        const createdComment: CommentViewModel = {
            id: (+new Date()).toString(),
            content: content,
            commentatorInfo: {
                userId: user!.userId,
                userLogin: user!.login
            },
            createdAt: new Date().toISOString()
        }

        return await commentsRepository.createComment(createdComment)
    },
    async updateComment(commentId: string, content: string): Promise<boolean> {
        return await commentsRepository.updateComment(commentId, content)
    },
    async deleteComment(id: string): Promise<boolean> {
        return await commentsRepository.deleteComment(id)
    },
    async deleteAll() {
        return await commentsRepository.deleteAll()
    }
}