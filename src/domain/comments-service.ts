import {RequestUserViewModel} from "../models/UserViewModel";
import {CommentsWithPaginationViewModel, CommentViewModel} from "../models/CommentViewModel";
import {commentsRepository} from "../repositories/comments-db-repository";

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
    }
}