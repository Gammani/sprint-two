import {BloggerViewModel} from "../models/BloggerViewModel";
import {bloggersCollection} from "./db";


export const bloggersRepository = {
    async findBloggers(name: string | null | undefined): Promise<BloggerViewModel[]> {
        const filter: any = {}

        if(name) {
            filter.name = {$regex: name}
        }

        return await bloggersCollection.find(filter, {projection: {_id: 0}}).toArray()
    }
}