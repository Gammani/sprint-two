import {PostsWithPaginationViewModel, PostViewModel} from "../models/PostViewModel";
import {BlogViewModel} from "../api/viewModels/BlogViewModel";
import {Post, PostDbType} from "../utils/types";
import {ObjectId} from "mongodb";
import {PostsRepository} from "../repositories/posts-mongoose-repository";
import {BlogsRepository} from "../repositories/blogs-mongoose-repository";
import {inject, injectable} from "inversify";


@injectable()
export class PostsService {
    constructor(
        @inject(PostsRepository) protected postsRepository: PostsRepository,
        @inject(BlogsRepository) protected blogsRepository: BlogsRepository) {
    }


    async findPosts(
        pageNumber: string,
        pageSize: string,
        sortBy: string,
        sortDirection: string,
        blogId?: string): Promise<PostsWithPaginationViewModel> {
        return await this.postsRepository.findPosts(
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
            blogId
        )
    }

    async findPostById(id: string): Promise<PostDbType | null> {
        return await this.postsRepository.findPostById(id)
    }

    async createPost(title: string, shortDescription: string, content: string, blogId: string): Promise<PostViewModel | null> {
        //const blog: Blog = blogRepo.getBlogById(blogId)
        //subscriptionService.createSubscribe('auto subscribe')
        const foundBlogger: BlogViewModel | null = await this.blogsRepository.findBlogById(blogId)
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
            const result = await this.postsRepository.createPost(createdPost)

            // return result.id
            return result
        }
        return null
    }

    async updatePost(postId: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean> {
        return await this.postsRepository.updatePost(postId, title, shortDescription, content, blogId)
    }

    async deletePost(id: string): Promise<boolean> {
        return await this.postsRepository.deletePost(id)
    }

    async deleteAll() {
        return await this.postsRepository.deleteAll()
    }
}