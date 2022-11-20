import {PostViewModel} from "../models/PostViewModel";
import {bloggersCollection, postsCollection} from "./db";
import {BloggerViewModel} from "../models/BloggerViewModel";
import {bloggersRepository} from "./bloggers-db-repository";

export const postsRepository = {
    async findPosts(title: string | undefined | null): Promise<PostViewModel[]> {
        const filter: any = {}

        if (title) {
            filter.title = {$regex: title}
        }
        return postsCollection.find(filter, {projection: {_id: 0}}).toArray();
    },
    async findPostById(id: string): Promise<PostViewModel | null> {
        const post: PostViewModel | null = await postsCollection.findOne({id: id}, {projection: {_id: 0}})
        if (post) {
            return post;
        } else {
            return null;
        }
    },
    async createPost(createdPost: PostViewModel): Promise<PostViewModel | null> {
        const result = await postsCollection.insertOne({...createdPost})
        return createdPost;
    },
    async updatePost(postId: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean> {
        const result = await postsCollection.updateOne({id: postId}, {
            $set: {
                title: title,
                shortDescription: shortDescription,
                content: content,
                blogId: blogId
            }
        })
        return result.matchedCount === 1

    },
    async deletePost(id: string): Promise<boolean> {
        const result = await postsCollection.deleteOne({id: id})
        return result.deletedCount === 1;
    },
    async deleteAll() {
        const result = await postsCollection.deleteMany({})
        return
    }
}