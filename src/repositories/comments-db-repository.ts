import {CommentsWithPaginationViewModel, CommentViewModel} from "../models/CommentViewModel";
import {commentsCollection, postsCollection} from "./db";

export const commentsRepository = {
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

        const items = await commentsCollection
            .find({}, {projection: {_id: 0}})
            .sort({[sortBy]: sortDirection})
            .skip(skipPages)
            .limit(pageSize)
            .toArray()
        const totalCount = await commentsCollection.find({postId: postId}).count({})
        const pageCount = Math.ceil(totalCount / pageSize)

        return {
            pagesCount: pageCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: items
        }
    },
    async findCommentById(id: string): Promise<CommentViewModel | null> {
        const foundComment: CommentViewModel | null = await commentsCollection.findOne({id: id}, {projection: {_id: 0}})
        if (foundComment) {
            return foundComment
        } else {
            return null
        }
    },
    async createComment(createdComment: CommentViewModel): Promise<CommentViewModel> {
        const result = await commentsCollection.insertOne({...createdComment})
        return createdComment
    },
    async updateComment(commentId: string, content: string): Promise<boolean> {
        const result = await commentsCollection.updateOne({id: commentId}, {
            $set: {
                content: content
            }
        })
        return result.matchedCount === 1
    },
    async deleteComment(id: string): Promise<boolean> {
        const result = await commentsCollection.deleteOne({id: id})
        return result.deletedCount === 1
    },
    async deleteAll() {
        const result = await commentsCollection.deleteMany({})
        return
    }
}