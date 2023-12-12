import {injectable} from "inversify";
import {BloggerWithPaginationViewModel} from "../api/viewModels/BlogViewModel";
import {BlogModel} from "../mongo/blog/blog.model";



@injectable()
export class BlogsQueryRepository {
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
        const sortDirection = sortDirectionQuery === 'asc' ? 1 : -1
//users?filter=name&filter=age
        //{filter: [name, age]}

        const filter: any = {}

        if (searchNameTerm) {
            filter.name = {$regex: searchNameTerm, "$options": "i" }
        }
        const skipPages: number = (pageNumber - 1) * pageSize

        const items = await BlogModel
            .find(filter, {projection: {_id: 0}})
            .sort({[sortBy]: sortDirection})
            .skip(skipPages)
            .limit(pageSize)
        const totalCount = await BlogModel.find(filter).count({})
        const pageCount = Math.ceil(totalCount/pageSize)

        return {
            pagesCount: pageCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: items.map(i => ({
                id: i._id.toString(),
                name: i.name,
                description: i.description,
                websiteUrl: i.websiteUrl,
                createdAt: i.createdAt,
                isMembership: i.isMembership
            }))
        }
    }
}