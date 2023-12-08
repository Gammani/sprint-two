import {CommentDBType, LikeDbType, LikeStatus} from "../utils/types";
import {ObjectId} from "mongodb";
import {LikeMongooseRepository} from "../repositories/like-mongoose-repository";

export class LikeStatusService {
    constructor(
        protected likeMongooseRepository = new LikeMongooseRepository()
    ) {
    }

    async findLike(commentId: ObjectId, userId: ObjectId): Promise<LikeDbType | null> {
        const foundLike: LikeDbType | null = await this.likeMongooseRepository.findLike(commentId, userId)
        if(foundLike) {
            return foundLike
        } else {
            return null
        }
    }

    async createLike(comment: CommentDBType, likeStatus: LikeStatus, userId: ObjectId) {
        debugger
        const foundLike = await this.findLike(comment._id, new ObjectId(userId))

        if(!foundLike) {
            const createdLike: LikeDbType = {
                _id: new ObjectId,
                userId: userId,
                blogId: comment._blogId,
                postId: comment._postId,
                commentId: comment._id,
                likeStatus: likeStatus,
                createdAt: new Date(),
                lastUpdate: new Date()
            }
            return await this.likeMongooseRepository.createLike(createdLike)
        } else {
            return
        }

    }

    async updateLikeStatus(likeStatus: LikeStatus, like: LikeDbType) {
        const isUpdate = await this.likeMongooseRepository.updateLikeStatus(likeStatus, like)
        return isUpdate
    }

}