import {RequestUserViewModel} from "../models/UserViewModel";
import {CommentViewModel} from "../models/CommentViewModel";
import {commentsRepository} from "../repositories/comments-db-repository";

export const commentsService = {
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