import {injectable} from "inversify";
import {PostModel} from "../mongo/post/post.model";
import {PostDbType} from "../utils/types";
import {PostViewModel} from "../models/PostViewModel";



@injectable()
export class PostsQueryRepository {
    async findPostByTitle(title: string): Promise<PostDbType | null> {
        const post: PostDbType | null = await PostModel.findOne({title: title})
        if (post) {
            return post
        } else {
            return null
        }
    }
    async findPostById(id: string): Promise<PostViewModel | null> {
        const foundPost: PostDbType | null = await PostModel.findOne({_id: id})
        if (foundPost) {
            return {
                id: foundPost._id.toString(),
                title: foundPost.title,
                shortDescription: foundPost.shortDescription,
                content: foundPost.content,
                blogId: foundPost.blogId,
                blogName: foundPost.blogName,
                createdAt: foundPost.createdAt
            }
        } else {
            return null
        }
    }
}