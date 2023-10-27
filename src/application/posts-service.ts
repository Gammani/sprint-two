import {PostsWithPaginationViewModel, PostViewModel} from "../models/PostViewModel";
import {BlogViewModel} from "../models/BlogViewModel";
import {blogService} from "./blogs-service";
import {Post} from "../utils/types";
import {postsRepository} from "../repositories/posts-mongoose-repository";
import {ObjectId} from "mongodb";

export const postsService = {
    // async findPosts(title: string | undefined | null): Promise<PostViewModel[]> {
    //     return await postsRepository.findPosts(title)
    // },
    async findPosts(
        pageNumber: string,
        pageSize: string,
        sortBy: string,
        sortDirection: string,
        blogId?: string): Promise<PostsWithPaginationViewModel> {
        return await postsRepository.findPosts(
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
            blogId
        )
    },
    async findPostById(id: string): Promise<PostViewModel | null> {
        return await postsRepository.findPostById(id)
    },
    async createPost(title: string, shortDescription: string, content: string, blogId: string): Promise<string | null> {
        //const blog: Blog = blogRepo.getBlogById(blogId)
        //subscriptionService.createSubscribe('auto subscribe')
        const foundBlogger: BlogViewModel | null = await blogService.findBlogById(blogId)
        if (foundBlogger) {
            const createdPost = new Post(
                new ObjectId,
                title,
                shortDescription,
                content,
                blogId,
                foundBlogger.name,
                new Date().toISOString()
            )
            const result = await postsRepository.createPost(createdPost)

            return result.id
        }
        return null
    },

    async updatePost(postId: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean> {
        return await postsRepository.updatePost(postId, title, shortDescription, content, blogId)
    },
    async deletePost(id: string): Promise<boolean> {
        return await postsRepository.deletePost(id)
    },
    async deleteAll() {
        return await postsRepository.deleteAll()
    }
}