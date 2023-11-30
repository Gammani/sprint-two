import {CommentDBType, LikeDbType} from "../utils/types";
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

    // async getLikeInfo(comment: CommentDBType, userId?: string) {
    //     let myStatus;
    //
    //     if (userId) {
    //         myStatus = await LikeModel.find({commentId: comment._id, userId})
    //     }
    //
    //     const result = {
    //         id: comment._id.toString(),
    //         likesInfo: {
    //             likesCount: await LikeModel.count({commentId: comment._id, status: 'Like'}),
    //             dislikesCount: await LikeModel.count({commentId: comment._id, status: 'Dislike'}),
    //             myStatus: myStatus ?? 'None'
    //         }
    //     }
    //     return result
    // }
}