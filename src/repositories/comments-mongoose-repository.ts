import {CommentsWithPaginationViewModel, CommentViewModel} from "../api/viewModels/CommentViewModel";
import {CommentModel} from "../mongo/comment/comment.model";
import {CommentDBType} from "../utils/types";
import {Comment} from "../utils/types"

export class CommentsRepository{
    async findComments(
        pageNumberQuery: string,
        pageSizeQuery: string,
        sortByQuery: string,
        sortDirectionQuery: string,
        postId: string
    ): Promise<CommentsWithPaginationViewModel> {
        const pageNumber = isNaN(Number(pageNumberQuery)) ? 1 : Number(pageNumberQuery)
        const pageSize = isNaN(Number(pageSizeQuery)) ? 10 : Number(pageSizeQuery)
        const sortBy = sortByQuery ? sortByQuery : 'createdAt'
        const sortDirection = sortDirectionQuery === 'asc' ? 1 : -1

        const skipPages: number = (pageNumber - 1) * pageSize

        const items = await CommentModel
            .find({_postId: postId})
            .sort({[sortBy]: sortDirection})
            .skip(skipPages)
            .limit(pageSize)
        const totalCount = await CommentModel.find({_postId: postId}).count({})
        const pageCount = Math.ceil(totalCount / pageSize)

        return {
            pagesCount: pageCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: items.map(i => ({
                id: i._id.toString(),
                content: i.content,
                commentatorInfo: i.commentatorInfo,
                createdAt: i.createdAt,
                likesInfo: i.likesInfo

            }))
        }
    }
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