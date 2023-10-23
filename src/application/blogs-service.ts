import {BlogViewModel, BloggerWithPaginationViewModel} from "../models/BlogViewModel";
import {blogsRepository} from "../repositories/blogs-mongoose-repository";
import {BlogType} from "../utils/types";
import {ObjectId} from "mongodb";



export const blogService = {
    async findBlogs(
        pageNumberQuery: string,
        pageSizeQuery: string,
        sortByQuery: string,
        sortDirectionQuery: string
    ): Promise<BloggerWithPaginationViewModel> {
        return await blogsRepository.findBlogs(
            pageNumberQuery,
            pageSizeQuery,
            sortByQuery,
            sortDirectionQuery)
    },
    // async findBloggersByQuery(name: string | null | undefined): Promise<BlogViewModel[]> {
    //     return await blogsQueryDbRepository.findBloggers(name)
    // },
    async findBlogById(id: string): Promise<BlogViewModel | null> {
        return await blogsRepository.findBlogById(id)
    },
    async createBlog(name: string, description: string, websiteUrl: string): Promise<BlogViewModel> {
        const newBlog = new BlogType(
            new ObjectId,
            name,
            description,
            websiteUrl,
            new Date().toISOString(),
            true)

        return await blogsRepository.createBlog(newBlog)
    },
    async updateBlog(id: string, description: string, name: string, websiteUrl: string): Promise<boolean> {
        return await blogsRepository.updateBlog(id, description, name, websiteUrl)
    },
    async deleteBlog(id: string): Promise<boolean> {
        return await blogsRepository.deleteBlog(id)
    },
    async deleteAll() {
        return await blogsRepository.deleteAll()
    }
}