import {CommentViewModel} from "../api/viewModels/CommentViewModel";
import {CommentModel} from "../mongo/comment/comment.model";
import {CommentDBType, LikesInfoType} from "../utils/types";

export class CommentsQueryRepository {
    async findCommentById(id: string): Promise<CommentViewModel | null> {
        const foundComment: CommentDBType | null = await CommentModel.findOne({_id: id})
        if (foundComment) {
            return {
                id: foundComment._id.toString(),
                content: foundComment.content,
                commentatorInfo: {
                  userId: foundComment.commentatorInfo.userId,
                  userLogin: foundComment.commentatorInfo.userLogin
                },
                createdAt: foundComment.createdAt,
                likesInfo: foundComment.likesInfo
            }
        } else {
            return null
        }
    }
}