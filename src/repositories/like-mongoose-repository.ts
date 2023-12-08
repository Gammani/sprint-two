import {CommentDBType, LikeDbType, LikeStatus} from "../utils/types";
import {ObjectId} from "mongodb";
import {LikeModel} from "../mongo/llikes/like.model";

export class LikeMongooseRepository {
    async findLike(commentId: ObjectId, userId: ObjectId): Promise<LikeDbType | null> {
        const result = await LikeModel.findOne({commentId: commentId, userId: userId})
        if (result) {
            return result
        }
        return null
    }


    async createLike(createdLike: LikeDbType) {
        debugger
        const like = new LikeModel({})

        like._id = createdLike._id
        like.userId = createdLike.userId
        like.blogId = createdLike.blogId
        like.postId = createdLike.postId
        like.commentId = createdLike.commentId
        like.likeStatus = createdLike.likeStatus
        like.createdAt = createdLike.createdAt
        like.lastUpdate = createdLike.lastUpdate

        const result = await like.save()
        return result
    }

    async updateLikeStatus(likeStatus: LikeStatus, like: LikeDbType) {
        const result = await LikeModel.updateOne({_id: like._id}, {
            $set: {
                likeStatus: likeStatus
            }
        })
        return result.matchedCount === 1
    }

    async deleteAll() {
        const result = await LikeModel.deleteMany({})
        return
    }
}