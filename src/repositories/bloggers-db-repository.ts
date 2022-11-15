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
    async creatBlogger(name: string, youtubeUrl: string): Promise<BloggerViewModel> {
        const newBlogger: BloggerViewModel = {id: (+new Date()).toString(), name: name, youtubeUrl: youtubeUrl}
        const result = await bloggersCollection.insertOne({id: (+new Date()).toString(), name: name, youtubeUrl: youtubeUrl})
        return newBlogger
    }
}