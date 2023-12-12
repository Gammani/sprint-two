import {injectable} from "inversify";
import {CommentsWithPaginationViewModel, CommentViewModel} from "../api/viewModels/CommentViewModel";
import {CommentModel} from "../mongo/comment/comment.model";
import {CommentDBType} from "../utils/types";
import {Comment} from "../utils/types"


@injectable()
export class CommentsRepository{


    async findCommentById(id: string): Promise<CommentDBType | null> {
        const foundComment: CommentDBType | null = await CommentModel.findOne({_id: id})
        if (foundComment) {
            return foundComment
        } else {
            return null
        }
    }

    // async createComment(createdComment: CommentDBType): Promise<CommentViewModel> {
    //     const commentInstance = new CommentModel({})
    //
    //     commentInstance.content = createdComment.content
    //     commentInstance.commentatorInfo = createdComment.commentatorInfo
    //     commentInstance.createdAt = createdComment.createdAt
    //     commentInstance._postId = createdComment._postId
    //
    //     const result = await commentInstance.save()
    //     return {
    //         id: result._id.toString(),
    //         content: result.content,
    //         commentatorInfo: {
    //             userId: result.commentatorInfo.userId,
    //             userLogin: result.commentatorInfo.userLogin
    //         },
    //         createdAt: result.createdAt
    //     }
    // }

    async createComment(createdComment: Comment): Promise<CommentDBType> {
        const commentInstance = new CommentModel({})

        commentInstance.content = createdComment.content
        commentInstance.commentatorInfo = createdComment.commentatorInfo
        commentInstance.createdAt = createdComment.createdAt
        commentInstance._postId = createdComment._postId
        commentInstance._blogId = createdComment._blogId
        commentInstance.likesInfo = createdComment.likesInfo

        const result = await commentInstance.save()
        return result
    }

    async findCommentByPostId(postId: string) {
        const result = await CommentModel.findOne({_postId: postId})
        return result
    }
    async findCommentByContent(content: string) {
        const result = await CommentModel.findOne({content: content})
        return result
    }
    async updateComment(commentId: string, content: string): Promise<boolean> {
        const result = await CommentModel.updateOne({_id: commentId}, {
            $set: {
                content: content
            }
        })
        return result.matchedCount === 1
    }
    async deleteComment(id: string): Promise<boolean> {
        const result = await CommentModel.deleteOne({_id: id})
        return result.deletedCount === 1
    }
    async deleteAll() {
        const result = await CommentModel.deleteMany({})
        return
    }
}