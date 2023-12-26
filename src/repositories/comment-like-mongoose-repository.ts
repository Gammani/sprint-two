import {injectable} from "inversify";
import {CommentLikeDbType, LikeStatus} from "../utils/types";
import {ObjectId} from "mongodb";
import {CommentLikeModel} from "../mongo/llikes/commentLikeModel";


@injectable()
export class CommentLikeMongooseRepository {
    async findLike(commentId: ObjectId, userId: ObjectId): Promise<CommentLikeDbType | null> {
        const result = await CommentLikeModel.findOne({commentId: commentId, userId: userId})
        if (result) {
            return result
        }
        return null
    }


    async createLike(createdLike: CommentLikeDbType) {
        const like = new CommentLikeModel({})

        like._id = createdLike._id
        like.userId = createdLike.userId
        like.login = createdLike.login
        like.blogId = createdLike.blogId
        like.postId = createdLike.postId
        like.commentId = createdLike.commentId
        like.likeStatus = createdLike.likeStatus
        like.addedAt = createdLike.addedAt
        like.lastUpdate = createdLike.lastUpdate

        const result = await like.save()
        return result
    }

    async updateLikeStatus(likeStatus: LikeStatus, like: CommentLikeDbType) {
        const result = await CommentLikeModel.updateOne({_id: like._id}, {
            $set: {
                likeStatus: likeStatus
            }
        })
        return result.matchedCount === 1
    }

    async deleteAll() {
        const result = await CommentLikeModel.deleteMany({})
        return
    }
}