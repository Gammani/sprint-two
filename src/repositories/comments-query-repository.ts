import {CommentsWithPaginationViewModel, CommentViewModel} from "../api/viewModels/CommentViewModel";
import {CommentModel} from "../mongo/comment/comment.model";
import {CommentDBType, LikeDbType, LikeStatus} from "../utils/types";
import {LikeModel} from "../mongo/llikes/like.model";

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
                likesInfo: {
                    likesCount: foundComment.likesInfo.likesCount,
                    dislikesCount: foundComment.likesInfo.dislikesCount,
                    myStatus: foundComment.likesInfo.myStatus
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
        let myStatus: LikeDbType | null = null;

        if (userId) {
            myStatus = await LikeModel.findOne({commentId: comment._id, userId})
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
                likesCount: await LikeModel.count({commentId: comment._id, status: 'Like'}),
                dislikesCount: await LikeModel.count({commentId: comment._id, status: 'Dislike'}),
                myStatus: myStatus ? myStatus.likeStatus : LikeStatus.None
            }
        }
        return result
    }

    // async findCommentsWithUser(
    //     pageNumberQuery: string,
    //     pageSizeQuery: string,
    //     sortByQuery: string,
    //     sortDirectionQuery: string,
    //     postId: string,
    //     userId?: string
    // ): Promise<CommentsWithPaginationViewModel> {
    //     const pageNumber = isNaN(Number(pageNumberQuery)) ? 1 : Number(pageNumberQuery)
    //     const pageSize = isNaN(Number(pageSizeQuery)) ? 10 : Number(pageSizeQuery)
    //     const sortBy = sortByQuery ? sortByQuery : 'createdAt'
    //     const sortDirection = sortDirectionQuery === 'asc' ? 1 : -1
    //
    //     const skipPages: number = (pageNumber - 1) * pageSize
    //
    //     //const comments = await commentModel.find({}).sort().skip().limit()
    //     //const result =await Promise.all( comments.map(c => getLikeInfo(c, userId)))
    //
    //
    //     //async getLikeInfo(comment, userId?: string){
    //     //let myStatus;
    //     //
    //     // if(userId){
    //     //          myStatus = await likeMode.find({commentId: comment._id, userId })
    //     //         //}
    //     //
    //     // const result = {
    //     // id: comment._id.toString(),
    //     //likesInfo:{
    //     //likesCount: await likesMode.count({commentId: comment._id, status: 'Like'})
    //     //myStatus: myStatus ?? 'None'
    //     //}}
    //     //return result
    //     //
    //     //
    //     //
    //     //
    //     //
    //     //
    //     //
    //     //
    //     //
    //     // }
    //
    //     // const items = await CommentModel
    //     //     .find({_postId: postId})
    //     //     .sort({[sortBy]: sortDirection})
    //     //     .skip(skipPages)
    //     //     .limit(pageSize)
    //     // const totalCount = await CommentModel.find({_postId: postId}).count({})
    //     // const pageCount = Math.ceil(totalCount / pageSize)
    //     //
    //     // return {
    //     //     pagesCount: pageCount,
    //     //     page: pageNumber,
    //     //     pageSize: pageSize,
    //     //     totalCount: totalCount,
    //     //     items: items.map(i => ({
    //     //
    //     //     }))
    //     // }
    //
    //
    //
    //
    //
    //
    //
    //
    //     const items: CommentDBType[] = await CommentModel
    //         .find({_postId: postId})
    //         .sort({[sortBy]: sortDirection})
    //         .skip(skipPages)
    //         .limit(pageSize)
    //
    //     const commentIds: ObjectId[] = items.map(item => item._id)
    //
    //     const likes: { _id: ObjectId, likesCount: number, dislikesCount: number, myStatus: { userId: string, likeStatus: LikeStatus }[] }[] = await LikeModel.aggregate([
    //         {
    //             $match: { commentId: { $in: commentIds } }
    //         },
    //         {
    //             $group: {
    //                 _id: "$commentId",
    //                 likesCount: { $sum: { $cond: [{ $eq: ["$likeStatus", "like"] }, 1, 0] } },
    //                 dislikesCount: { $sum: { $cond: [{ $eq: ["$likeStatus", "dislike"] }, 1, 0] } },
    //                 myStatus: {
    //                     $push: {
    //                         userId: "$userId",
    //                         likeStatus: "$likeStatus"
    //                     }
    //                 }
    //             }
    //         }
    //     ])
    //
    //     const likesMap: Record<string, LikesInfoType> = {}
    //     likes.forEach(like => {
    //         likesMap[like._id] = like
    //     })
    //
    //     const formattedItems = items.map(item => ({
    //         id: item._id,
    //         content: item.content,
    //         commentatorInfo: item.commentatorInfo,
    //         createdAt: item.createdAt,
    //         likesInfo: {
    //             likesCount: likesMap[item._id] ? likesMap[item._id].likesCount : 0,
    //             dislikesCount: likesMap[item._id] ? likesMap[item._id].dislikesCount : 0,
    //             myStatus: likesMap[item._id] && likesMap[item._id].myStatus.some(status => status.userId === userId) ?
    //                 likesMap[item._id].myStatus.find(status => status.userId === userId).likeStatus : "None"
    //         }
    //     })
    //
    //     const totalCount = await CommentModel.find({_postId: postId}).count({})
    //     const pageCount = Math.ceil(totalCount / pageSize)
    //
    //     return {
    //         pagesCount: pageCount,
    //         page: pageNumber,
    //         pageSize: pageSize,
    //         totalCount: totalCount,
    //         items: formattedItems
    //     }
    //
    //
    //
    //
    //
    // }
    //
    // async findCommentsWithUserWithUserNoName(
    //     pageNumberQuery: string,
    //     pageSizeQuery: string,
    //     sortByQuery: string,
    //     sortDirectionQuery: string,
    //     postId: string
    // ): Promise<CommentsWithPaginationViewModel> {
    //     const pageNumber = isNaN(Number(pageNumberQuery)) ? 1 : Number(pageNumberQuery)
    //     const pageSize = isNaN(Number(pageSizeQuery)) ? 10 : Number(pageSizeQuery)
    //     const sortBy = sortByQuery ? sortByQuery : 'createdAt'
    //     const sortDirection = sortDirectionQuery === 'asc' ? 1 : -1
    //
    //     const skipPages: number = (pageNumber - 1) * pageSize
    //
    //     const items = await CommentModel
    //         .find({_postId: postId})
    //         .sort({[sortBy]: sortDirection})
    //         .skip(skipPages)
    //         .limit(pageSize)
    //     const totalCount = await CommentModel.find({_postId: postId}).count({})
    //     const pageCount = Math.ceil(totalCount / pageSize)
    //
    //     return {
    //         pagesCount: pageCount,
    //         page: pageNumber,
    //         pageSize: pageSize,
    //         totalCount: totalCount,
    //         items: items.map(i => ({
    //             id: i._id.toString(),
    //             content: i.content,
    //             commentatorInfo: i.commentatorInfo,
    //             createdAt: i.createdAt,
    //             likesInfo: {
    //                 likesCount: 0,
    //                 dislikesCount: 0,
    //                 myStatus: 'Like'
    //             }
    //
    //         }))
    //     }
    // }


    // async getLikeInfo(comment: CommentDBType, userId?: string) {
    //     let myStatus;
    //
    //     if (userId) {
    //         myStatus = await LikeModel.find({commentId: comment._id, userId})
    //     }
    //
    //     const result = {
    //         id: comment._id.toString(),
    //         content: comment.content,
    //         commentatorInfo: {
    //           userId: comment.commentatorInfo.userId,
    //           userLogin: comment.commentatorInfo.userLogin
    //         },
    //         createdAt: comment.createdAt,
    //         likesInfo: {
    //             likesCount: await LikeModel.count({commentId: comment._id, status: 'Like'}),
    //             dislikesCount: await LikeModel.count({commentId: comment._id, status: 'Dislike'}),
    //             myStatus: myStatus ?? 'None'
    //         }
    //     }
    //     return result
    // }

}