import {BloggerWithPaginationViewModel, BlogViewModel} from "../api/viewModels/BlogViewModel";
import {BlogModel} from "../mongo/blog/blog.model";
import {Blog, BlogDBType} from "../utils/types";
import {getBlogViewModel} from "../utils/utils";


class BlogsRepository {
    async findBlogs(
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

        const items = await BlogModel
            .find({})
            .sort({[sortBy]: sortDirection})
            .skip(skipPages)
            .limit(pageSize)
        const totalCount = await BlogModel.countDocuments({})
        const pageCount = Math.ceil(totalCount / pageSize)

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
    async findBlogById(id: string): Promise<BlogViewModel | null> {
        const blog: BlogDBType | null = await BlogModel.findOne({_id: id})
        if (blog) {
            return getBlogViewModel(blog)
        } else {
            return null
        }
    }
    async findBlogByName(blogName: string) {
        const foundBlog = await BlogModel.findOne({name: blogName})
        return foundBlog
    }
    async createBlog(newBlog: Blog): Promise<BlogViewModel> {
        const blogInstance = new BlogModel({name: newBlog.name})

        blogInstance.createdAt = newBlog.createdAt
        blogInstance.description = newBlog.description
        blogInstance.isMembership = newBlog.isMembership
        blogInstance.name = newBlog.name
        blogInstance.websiteUrl = newBlog.websiteUrl

        const result = await blogInstance.save()

        // return result._id.toString()
        return {
            id: result._id.toString(),
            createdAt: result.createdAt,
            description: result.description,
            isMembership: result.isMembership,
            name: result.name,
            websiteUrl: result.websiteUrl
        }
        // return result
    }
    async updateBlog(id: string, description: string, name: string, websiteUrl: string): Promise<boolean> {
        const result = await BlogModel.updateOne({_id: id}, {
            $set: {
                name: name,
                description: description,
                websiteUrl: websiteUrl
            }
        })
        return result.matchedCount === 1;
    }
    async deleteBlog(id: string): Promise<boolean> {
        const result = await BlogModel.deleteOne({_id: id})
        return result.deletedCount === 1;
    }
    async deleteAll() {
        const result = await BlogModel.deleteMany({})
        return
    }
}

export const blogsRepository = new BlogsRepository()



// export const blogsRepository = {
//     async findBlogs(
//         pageNumberQuery: string,
//         pageSizeQuery: string,
//         sortByQuery: string,
//         sortDirectionQuery: string
//     ): Promise<BloggerWithPaginationViewModel> {
//
//         const pageNumber = isNaN(Number(pageNumberQuery)) ? 1 : Number(pageNumberQuery)
//         const pageSize = isNaN(Number(pageSizeQuery)) ? 10 : Number(pageSizeQuery)
//         const sortBy = sortByQuery ? sortByQuery : 'createdAt'
//         const sortDirection = sortDirectionQuery === 'asc' ? 1 : -1
//
//         const skipPages: number = (pageNumber - 1) * pageSize
//
//         const items = await BlogModel
//             .find({})
//             .sort({[sortBy]: sortDirection})
//             .skip(skipPages)
//             .limit(pageSize)
//         const totalCount = await BlogModel.countDocuments({})
//         const pageCount = Math.ceil(totalCount / pageSize)
//
//         return {
//             pagesCount: pageCount,
//             page: pageNumber,
//             pageSize: pageSize,
//             totalCount: totalCount,
//             items: items.map(i => ({
//                 id: i._id.toString(),
//                 name: i.name,
//                 description: i.description,
//                 websiteUrl: i.websiteUrl,
//                 createdAt: i.createdAt,
//                 isMembership: i.isMembership
//             }))
//         }
//     },
//     async findBlogById(id: string): Promise<BlogViewModel | null> {
//         const blog: BlogDBType | null = await BlogModel.findOne({_id: id})
//         if (blog) {
//             return getBlogViewModel(blog)
//         } else {
//             return null
//         }
//     },
//     async findBlogByName(blogName: string) {
//         const foundBlog = await BlogModel.findOne({name: blogName})
//         return foundBlog
//     },
//     async createBlog(newBlog: Blog): Promise<BlogViewModel> {
//         const blogInstance = new BlogModel({name: newBlog.name})
//
//         blogInstance.createdAt = newBlog.createdAt
//         blogInstance.description = newBlog.description
//         blogInstance.isMembership = newBlog.isMembership
//         blogInstance.name = newBlog.name
//         blogInstance.websiteUrl = newBlog.websiteUrl
//
//         const result = await blogInstance.save()
//
//         // return result._id.toString()
//         return {
//             id: result._id.toString(),
//             createdAt: result.createdAt,
//             description: result.description,
//             isMembership: result.isMembership,
//             name: result.name,
//             websiteUrl: result.websiteUrl
//         }
//         // return result
//     },
//     async updateBlog(id: string, description: string, name: string, websiteUrl: string): Promise<boolean> {
//         const result = await BlogModel.updateOne({_id: id}, {
//             $set: {
//                 name: name,
//                 description: description,
//                 websiteUrl: websiteUrl
//             }
//         })
//         return result.matchedCount === 1;
//     },
//     async deleteBlog(id: string): Promise<boolean> {
//         const result = await BlogModel.deleteOne({_id: id})
//         return result.deletedCount === 1;
//     },
//     async deleteAll() {
//         const result = await BlogModel.deleteMany({})
//         return
//     }
// }