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

    async createLike(comment: CommentDBType, likeStatus: LikeStatus) {
        const foundLike = await this.findLike(comment._id, new ObjectId(comment.commentatorInfo.userId))

        if(!foundLike) {
            const createdLike: LikeDbType = {
                _id: new ObjectId,
                userId: new ObjectId(comment.commentatorInfo.userId),
                blogId: comment._blogId,
                postId: comment._postId,
                commentId: comment._id,
                likeStatus: likeStatus,
                createdAt: new Date(),
                lastUpdate: new Date()
            }
            return await this.likeMongooseRepository.createLike(createdLike)
        }



    }
}