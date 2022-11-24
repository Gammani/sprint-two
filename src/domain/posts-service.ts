import {PostsWithPaginationViewModel, PostViewModel} from "../models/PostViewModel";
import {BloggerViewModel} from "../models/BloggerViewModel";
import {postsRepository} from "../repositories/posts-db-repository";
import {bloggerService} from "./bloggers-service";

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
            sortDirection)
    },
    async findPostById(id: string): Promise<PostViewModel | null> {
        return await postsRepository.findPostById(id)
    },
    async createPost(title: string, shortDescription: string, content: string, blogId: string): Promise<PostViewModel | null> {
        const foundBlogger: BloggerViewModel | null = await bloggerService.findBloggerById(blogId)
        if (foundBlogger) {
            const createdPost: PostViewModel = {
                id: (+new Date()).toString(),
                title,
                shortDescription,
                content,
                blogId,
                blogName: foundBlogger.name,
                createdAt: foundBlogger.createdAt
            }
            return await postsRepository.createPost(createdPost)
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