import {injectable} from "inversify";
import {PostLikeModel} from "../mongo/llikes/postLikeModel";
import {ObjectId} from "mongodb";
import {LikeStatus, PostLikeDbType} from "../utils/types";


@injectable()
export class PostLikeMongooseRepository {
    async findPostLike(postId: ObjectId, userId: ObjectId): Promise<PostLikeDbType | null> {
        const result = await PostLikeModel.findOne({postId: postId, userId: userId})
        if(result) {
            return result
        } else {
            return null
        }
    }

    async createPostLike(createdPostLike: PostLikeDbType) {
        const postLike = new PostLikeModel({})

        postLike._id = createdPostLike._id
        postLike.userId = createdPostLike.userId
        postLike.login = createdPostLike.login
        postLike.blogId = createdPostLike.blogId
        postLike.postId = createdPostLike.postId
        postLike.likeStatus = createdPostLike.likeStatus
        postLike.addedAt = createdPostLike.addedAt
        postLike.lastUpdate = createdPostLike.lastUpdate

        const result = await postLike.save()
        return result
    }

    async updatePostLikeStatus(likeStatus: LikeStatus, like: PostLikeDbType) {
        const result = await PostLikeModel.updateOne({_id: like._id}, {
            $set: {
                likeStatus: likeStatus, lastUpdate: new Date().toString()
            }
        })
        return result.matchedCount === 1
    }

    async deleteAll() {
        const result = await PostLikeModel.deleteMany({})
        return
    }
}