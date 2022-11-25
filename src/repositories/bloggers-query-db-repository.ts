import {BloggerWithPaginationViewModel} from "../models/BloggerViewModel";
import {bloggersCollection} from "./db";

export const bloggersQueryDbRepository = {
    async findBloggers(
        searchNameTermQuery: string | undefined,
        pageNumberQuery: string,
        pageSizeQuery: string,
        sortByQuery: string,
        sortDirectionQuery: string
    ): Promise<BloggerWithPaginationViewModel> {

        const searchNameTerm = searchNameTermQuery ? searchNameTermQuery : null
        const pageNumber = isNaN(Number(pageNumberQuery)) ? 1 : Number(pageNumberQuery)
        const pageSize = isNaN(Number(pageSizeQuery)) ? 10 : Number(pageSizeQuery)
        const sortBy = sortByQuery ? sortByQuery : 'createdAt'
        const sortDirection = sortDirectionQuery === 'asc' ? -1 : 1


        const filter: any = {}

        if (searchNameTerm) {
            filter.name = {$regex: searchNameTerm, "$options": "i" }
        }
        const skipPages: number = (pageNumber - 1) * pageSize

        const items = await bloggersCollection
            .find(filter, {projection: {_id: 0}})
            .sort({[sortBy]: sortDirection})
            .skip(skipPages)
            .limit(pageSize)
            .toArray()
        const totalCount = await bloggersCollection.find(filter).count({})
        const pageCount = Math.ceil(totalCount/pageSize)

        return {
            pagesCount: pageCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: items
        }
    },
}