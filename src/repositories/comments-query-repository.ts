import {injectable} from "inversify";
import {CommentsWithPaginationViewModel, CommentViewModel} from "../api/viewModels/CommentViewModel";
import {CommentModel} from "../mongo/comment/comment.model";
import {CommentDBType, CommentLikeDbType, LikeStatus} from "../utils/types";
import {CommentLikeModel} from "../mongo/llikes/commentLikeModel";
import {ObjectId} from "mongodb";
import {presetQueryParams, presetQueryParamsType} from "../utils/utils";




@injectable()
export class CommentsQueryRepository {
    async findCommentById(id: string, userId?: ObjectId): Promise<CommentViewModel | null> {
        const foundComment: CommentDBType | null = await CommentModel.findOne({_id: id})


        if (foundComment) {
            const myStatus = await CommentLikeModel.findOne({commentId: foundComment._id, userId})

            return {
                id: foundComment._id.toString(),
                content: foundComment.content,
                commentatorInfo: {
                    userId: foundComment.commentatorInfo.userId,
                    userLogin: foundComment.commentatorInfo.userLogin
                },
                createdAt: foundComment.createdAt,
                likesInfo: {
                    likesCount: await CommentLikeModel.count({commentId: foundComment._id, likeStatus: LikeStatus.Like}),
                    dislikesCount: await CommentLikeModel.count({commentId: foundComment._id, likeStatus: LikeStatus.Dislike}),
                    myStatus: myStatus ? myStatus.likeStatus : LikeStatus.None
                }
            }
        } else {
            return null
        }
    }


    async findComments(pageNumberQuery: string,
                       pageSizeQuery: string,
                       sortByQuery: string,
                       sortDirectionQuery: string,
                       postId: string,
                       userId?: string): Promise<CommentsWithPaginationViewModel> {


        const pageNumber = isNaN(Number(pageNumberQuery)) ? 1 : Number(pageNumberQuery)
        const pageSize = isNaN(Number(pageSizeQuery)) ? 10 : Number(pageSizeQuery)
        const sortBy = sortByQuery ? sortByQuery : 'createdAt'
        const sortDirection = sortDirectionQuery === 'asc' ? 1 : -1
        // const queryParams: presetQueryParamsType = presetQueryParams(pageNumberQuery, pageSizeQuery, sortByQuery, sortDirectionQuery)
        // const pageNumber = queryParams.pageNumber
        // const pageSize = queryParams.pageSize
        // const sortBy = queryParams.sortBy
        // const sortDirection = queryParams.sortDirection

        const skipPages: number = (pageNumber - 1) * pageSize


        const items = await CommentModel
            .find({_postId: postId})
            .sort({[sortBy]: sortDirection})
            .skip(skipPages)
            .limit(pageSize)
        const totalCount = await CommentModel.find({_postId: postId}).count({})
        const pageCount = Math.ceil(totalCount / pageSize)

        const result = await Promise.all(items.map(item => this.getLikeInfo(item, userId)))


        return {
            pagesCount: pageCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: result.map(r => ({
                id: r.id,
                content: r.content,
                commentatorInfo: {
                    userId: r.commentatorInfo.userId,
                    userLogin: r.commentatorInfo.userLogin
                },
                createdAt: r.createdAt,
                likesInfo: {
                    likesCount: r.likesInfo.likesCount,
                    dislikesCount: r.likesInfo.dislikesCount,
                    myStatus: r.likesInfo.myStatus
                }
            }))
        }
    }


    async getLikeInfo(comment: CommentDBType, userId?: string) {
        let myStatus: CommentLikeDbType | null = null

        if (userId) {
            myStatus = await CommentLikeModel.findOne({commentId: comment._id, userId})
        }

        const result = {
            id: comment._id.toString(),
            content: comment.content,
            commentatorInfo: {
                userId: comment.commentatorInfo.userId,
                userLogin: comment.commentatorInfo.userLogin
            },
            createdAt: comment.createdAt,
            likesInfo: {
                // likesCount: await LikeModel.count({commentId: comment._id, likeStatus: 'Like'}),
                // dislikesCount: await LikeModel.count({commentId: comment._id, likeStatus: 'Dislike'}),
                likesCount: await CommentLikeModel.find({commentId: comment._id, likeStatus: LikeStatus.Like}).count({}),
                dislikesCount: await CommentLikeModel.find({commentId: comment._id, likeStatus: LikeStatus.Dislike}).count({}),
                myStatus: myStatus ? myStatus.likeStatus : LikeStatus.None
            }
        }
        return result
    }

}