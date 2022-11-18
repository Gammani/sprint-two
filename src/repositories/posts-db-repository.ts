import {PostViewModel} from "../models/PostViewModel";
import {bloggersCollection, postsCollection} from "./db";
import {BloggerViewModel} from "../models/BloggerViewModel";
import {bloggersRepository} from "./bloggers-db-repository";

export const postsRepository = {
    async findPosts(title: string | undefined | null): Promise<PostViewModel[]> {
        const filter: any = {}

        if(title) {
            filter.title = {$regex: title}
        }
        return postsCollection.find(filter, {projection: {_id: 0}}).toArray();
    },
    async findPostById(id: string): Promise<PostViewModel | null> {
        const post: PostViewModel | null = await postsCollection.findOne({id: id}, {projection: {_id: 0}})
        if(post) {
            return post;
        } else {
            return null;
        }
    },
    async createPost(title: string, shortDescription: string, content: string, blogId: string): Promise<PostViewModel | null> {
        const foundBlogger: BloggerViewModel | null = await bloggersCollection.findOne({id: blogId}, {projection: {_id: 0}})
        if(foundBlogger) {
            const newPost: PostViewModel = {
                id: (+new Date()).toString(), title, shortDescription, content, blogId, blogName: foundBlogger.name, createdAt: foundBlogger.createdAt
            }
            const result = await postsCollection.insertOne(newPost)
            return newPost;
        } else {
            return null
        }
    },
    async updatePost(postId: string, title: string, shortDescription: string, content: string, blogId: string): Promise<string> {
        const foundPost: PostViewModel | null = await postsCollection.findOne({id: postId})
        if(foundPost) {
            const blogger: BloggerViewModel | null = await bloggersRepository.findBloggerById(blogId)
            if(!blogger) {
                return 'not found bloggerId'
            } else {
                const result = postsCollection.updateOne({id: postId}, {title: title, shortDescription: shortDescription, content: content, bloggerId: blogId})
                return 'no content'
            }
        } else {
            return 'invalid id'
        }
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