import {BloggerViewModel, BloggerWithPaginationViewModel} from "../models/BloggerViewModel";
import {bloggersCollection} from "./db";


export const bloggersRepository = {
    async findBloggers(
        pageNumberQuery: string,
        pageSizeQuery: string,
        sortByQuery: string,
        sortDirectionQuery: string
    ): Promise<BloggerWithPaginationViewModel> {

        const pageNumber = isNaN(Number(pageNumberQuery)) ? 1 : Number(pageNumberQuery)
        const pageSize = isNaN(Number(pageSizeQuery)) ? 10 : Number(pageSizeQuery)
        const sortBy = sortByQuery ? sortByQuery : 'createdAt'
        const sortDirection = sortDirectionQuery === 'asc' ? 1 : -1

        const skipPages: number = (pageNumber - 1) * pageSize

        const items = await bloggersCollection
            // .find({[sortBy]: sortDirection}, {projection: {_id: 0}})
            .find({}, {projection: {_id: 0}})
            .sort({[sortBy]: sortDirection})
            .skip(skipPages)
            .limit(pageSize)
            .toArray()
        const totalCount = await bloggersCollection.find({}).count({})
        const pageCount = Math.ceil(totalCount/pageSize)

        return {
            pagesCount: pageCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: items
        }
    },
    async findBloggerById(id: string): Promise<BloggerViewModel | null> {
        const blogger: BloggerViewModel | null = await bloggersCollection.findOne({id: id}, {projection: {_id: 0}})
        if (blogger) {
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
        const result = await bloggersCollection.updateOne({id: id}, {
            $set: {
                name: name,
                description: description,
                websiteUrl: websiteUrl
            }
        })
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