import {BloggerViewModel} from "../models/BloggerViewModel";
import {bloggersCollection} from "./db";


export const bloggersRepository = {
    async findBloggers(name: string | null | undefined): Promise<BloggerViewModel[]> {
        const filter: any = {}

        if(name) {
            filter.name = {$regex: name}
        }

        return await bloggersCollection.find(filter, {projection: {_id: 0}}).toArray()
    },
    async findBloggerById(id: string): Promise<BloggerViewModel | null> {
        const blogger: BloggerViewModel | null = await bloggersCollection.findOne({id: id}, {projection: {_id: 0}})
        if(blogger) {
            return blogger
        } else {
            return null
        }
    },
    async creatBlogger(newBlogger: BloggerViewModel): Promise<BloggerViewModel> {
        const result = await bloggersCollection.insertOne({...newBlogger})
        return newBlogger
    },
    async updateBlogger(id: string, description: string, name: string, websiteUrl: string): Promise<boolean> {
        const result = await bloggersCollection.updateOne({id: id}, {$set: {name: name, description: description, websiteUrl: websiteUrl}})
        return result.matchedCount === 1;
    },
    async deleteBlogger(id: string): Promise<boolean> {
        const result = await bloggersCollection.deleteOne({id: id})
        return result.deletedCount === 1;
    },
    async deleteAll() {
        const result = await bloggersCollection.deleteMany({})
        return
    }
}