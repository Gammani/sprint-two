import {inject, injectable} from "inversify";
import {PostLikeMongooseRepository} from "../repositories/post-like-mongoose-repository";
import {ObjectId} from "mongodb";
import {LikeStatus, PostDbType, PostLikeDbType} from "../utils/types";


@injectable()
export class PostLikeStatusService {
    constructor(
        @inject(PostLikeMongooseRepository) protected postLikeMongooseRepository: PostLikeMongooseRepository
    ) {
    }

    async findPostLike(postId: ObjectId, userId: ObjectId): Promise<PostLikeDbType | null> {
        const result = await this.postLikeMongooseRepository.findPostLike(postId, userId)
        if(result) {
            return result
        } else {
            return null
        }
    }

    async createPostLike(userId: ObjectId, login: string, post: PostDbType, likeStatus: LikeStatus) {
        const foundPostLike = await this.postLikeMongooseRepository.findPostLike(post._id, userId)

        if(!foundPostLike) {
            const createdPostLike = {
                _id: new ObjectId,
                userId: userId,
                login: login,
                blogId: new ObjectId(post.blogId),
                postId: post._id,
                likeStatus: likeStatus,
                addedAt: new Date().toISOString(),
                lastUpdate: new Date().toISOString()
            }
            return await this.postLikeMongooseRepository.createPostLike(createdPostLike)
        } else {
            return
        }
    }

    async updatePostLikeStatus(likeStatus: LikeStatus, like: PostLikeDbType) {
        const isUpdate = await this.postLikeMongooseRepository.updatePostLikeStatus(likeStatus, like)
        return isUpdate
    }
}