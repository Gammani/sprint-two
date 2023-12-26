import {CommentDBType, CommentLikeDbType, LikeStatus} from "../utils/types";
import {ObjectId} from "mongodb";
import {CommentLikeMongooseRepository} from "../repositories/comment-like-mongoose-repository";
import {inject, injectable} from "inversify";


@injectable()
export class CommentLikeStatusService {
    constructor(
        @inject(CommentLikeMongooseRepository) protected commentLikeMongooseRepository: CommentLikeMongooseRepository
    ) {
    }

    async findLike(commentId: ObjectId, userId: ObjectId): Promise<CommentLikeDbType | null> {
        const foundLike: CommentLikeDbType | null = await this.commentLikeMongooseRepository.findLike(commentId, userId)
        if(foundLike) {
            return foundLike
        } else {
            return null
        }
    }

    async createLike(comment: CommentDBType, likeStatus: LikeStatus, userId: ObjectId, userLogin: string) {
        const foundLike = await this.findLike(comment._id, new ObjectId(userId))

        if(!foundLike) {
            const createdCommentLike: CommentLikeDbType = {
                _id: new ObjectId,
                userId: userId,
                login: userLogin,
                blogId: comment._blogId,
                postId: comment._postId,
                commentId: comment._id,
                likeStatus: likeStatus,
                addedAt: new Date(),
                lastUpdate: new Date()
            }
            return await this.commentLikeMongooseRepository.createLike(createdCommentLike)
        } else {
            return
        }

    }

    async updateLikeStatus(likeStatus: LikeStatus, like: CommentLikeDbType) {
        const isUpdate = await this.commentLikeMongooseRepository.updateLikeStatus(likeStatus, like)
        return isUpdate
    }

}