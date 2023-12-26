import {PostsWithPaginationViewModel, PostViewModel} from "../models/PostViewModel";
import {BlogViewModel} from "../api/viewModels/BlogViewModel";
import {LikeStatus, Post, PostDbType} from "../utils/types";
import {ObjectId} from "mongodb";
import {PostsRepository} from "../repositories/posts-mongoose-repository";
import {BlogsRepository} from "../repositories/blogs-mongoose-repository";
import {inject, injectable} from "inversify";
import {PostsQueryRepository} from "../repositories/posts-query-mongoose-repository";


@injectable()
export class PostsService {
    constructor(
        @inject(PostsRepository) protected postsRepository: PostsRepository,
        @inject(BlogsRepository) protected blogsRepository: BlogsRepository,
        @inject(PostsQueryRepository) protected postsQueryRepository: PostsQueryRepository) {
    }


    async findPosts(
        pageNumber: string,
        pageSize: string,
        sortBy: string,
        sortDirection: string,
        userId?: string,
        blogId?: string): Promise<PostsWithPaginationViewModel> {
        return await this.postsQueryRepository.findPosts(
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
            userId,
            blogId)
    }

    async findPostById(id: string): Promise<PostDbType | null> {
        return await this.postsRepository.findPostById(id)
    }

    async createPost(title: string, shortDescription: string, content: string, blogId: string): Promise<PostViewModel | null> {
        //const blog: Blog = blogRepo.getBlogById(blogId)
        //subscriptionService.createSubscribe('auto subscribe')
        const foundBlogger: BlogViewModel | null = await this.blogsRepository.findBlogById(blogId)
        if (foundBlogger) {
            const createdPost: PostDbType = {
                _id: new ObjectId,
                title: title,
                shortDescription: shortDescription,
                content: content,
                blogId: blogId,
                blogName: foundBlogger.name,
                createdAt: new Date().toISOString(),
                extendedLikesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: LikeStatus.None,
                    newestLikes: []
                }
            }
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