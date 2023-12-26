import {injectable} from "inversify";
import {PostViewModel} from "../models/PostViewModel";
import {PostModel} from "../mongo/post/post.model";
import {LikeStatus, Post, PostDbType} from "../utils/types";


@injectable()
export class PostsRepository {
    async findPostById(id: string): Promise<PostDbType | null> {
        const post: PostDbType | null = await PostModel.findOne({_id: id})
        if (post) {
            return post;
        } else {
            return null;
        }
    }

    async findPostByName(postName: string) {
        const foundPost = await PostModel.findOne({name: postName})
        return foundPost
    }

    async createPost(createdPost: Post): Promise<PostViewModel> {
        const postInstance = new PostModel()

        postInstance.title = createdPost.title,
            postInstance.shortDescription = createdPost.shortDescription,
            postInstance.content = createdPost.content,
            postInstance.blogId = createdPost.blogId,
            postInstance.blogName = createdPost.blogName,
            postInstance.createdAt = createdPost.createdAt,
            postInstance.extendedLikesInfo = createdPost.extendedLikesInfo

        const result = await postInstance.save()


        return {
            id: result._id.toString(),
            title: result.title,
            shortDescription: result.shortDescription,
            content: result.content,
            blogId: result.blogId,
            blogName: result.blogName,
            createdAt: result.createdAt,
            extendedLikesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: LikeStatus.None,
                newestLikes: []
            }
        }
    }
    async updatePost(postId: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean> {
        const result = await PostModel.updateOne({_id: postId}, {
            $set: {
                title: title,
                shortDescription: shortDescription,
                content: content,
                blogId: blogId
            }
        })
        return result.matchedCount === 1

    }
    async deletePost(id: string): Promise<boolean> {
        const result = await PostModel.deleteOne({_id: id})
        return result.deletedCount === 1;
    }
    async deleteAll() {
        const result = await PostModel.deleteMany({})
        return
    }
}