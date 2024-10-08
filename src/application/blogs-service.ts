import {BlogViewModel, BloggerWithPaginationViewModel} from "../api/viewModels/BlogViewModel";
import {Blog} from "../utils/types";
import {ObjectId} from "mongodb";
import {BlogsRepository} from "../repositories/blogs-mongoose-repository";
import {inject, injectable} from "inversify";


@injectable()
export class BlogsService {
    constructor(@inject(BlogsRepository) protected blogsRepository: BlogsRepository) {}

    async findBlogs(
        pageNumberQuery: string,
        pageSizeQuery: string,
        sortByQuery: string,
        sortDirectionQuery: string
    ): Promise<BloggerWithPaginationViewModel> {
        return await this.blogsRepository.findBlogs(
            pageNumberQuery,
            pageSizeQuery,
            sortByQuery,
            sortDirectionQuery)
    }

    // async findBloggersByQuery(name: string | null | undefined): Promise<BlogViewModel[]> {
    //     return await blogsQueryMongooseRepository.findBloggers(name)
    // },
    async findBlogById(id: string): Promise<BlogViewModel | null> {
        return await this.blogsRepository.findBlogById(id)
    }

    async createBlog(name: string, description: string, websiteUrl: string): Promise<BlogViewModel> {
        const newBlog = new Blog(
            new ObjectId,
            name,
            description,
            websiteUrl,
            new Date().toISOString(),
            true)

        return await this.blogsRepository.createBlog(newBlog)
    }

    async updateBlog(id: string, description: string, name: string, websiteUrl: string): Promise<boolean> {
        return await this.blogsRepository.updateBlog(id, description, name, websiteUrl)
    }

    async deleteBlog(id: string): Promise<boolean> {
        return await this.blogsRepository.deleteBlog(id)
    }

    async deleteAll() {
        return await this.blogsRepository.deleteAll()
    }
}