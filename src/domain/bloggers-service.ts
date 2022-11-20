import {BloggerViewModel} from "../models/BloggerViewModel";
import {bloggersRepository} from "../repositories/bloggers-db-repository";

export const bloggerService = {
    async findBloggers(name: string | null | undefined): Promise<BloggerViewModel[]> {
        return await bloggersRepository.findBloggers(name)
    },
    async findBloggerById(id: string): Promise<BloggerViewModel | null> {
        return await bloggersRepository.findBloggerById(id)
    },
    async creatBlogger(name: string, description: string, websiteUrl: string): Promise<BloggerViewModel> {
        const newBlogger: BloggerViewModel = {
            id: (+new Date()).toString(),
            name: name,
            description: description,
            websiteUrl: websiteUrl,
            createdAt: new Date().toISOString()
        }
        return await bloggersRepository.creatBlogger(newBlogger)
    },
    async updateBlogger(id: string, description: string, name: string, websiteUrl: string): Promise<boolean> {
        return await bloggersRepository.updateBlogger(id, description, name, websiteUrl)
    },
    async deleteBlogger(id: string): Promise<boolean> {
        return await bloggersRepository.deleteBlogger(id)
    },
    async deleteAll() {
        return await bloggersRepository.deleteAll()
    }
}