import {PostsWithPaginationViewModel, PostViewModel} from "../models/PostViewModel";
import {PostModel} from "../mongo/post/post.model";
import {Post} from "../utils/types";


class PostsRepository {
    async findPosts(
        pageNumberQuery: string,
        pageSizeQuery: string,
        sortByQuery: string,
        sortDirectionQuery: string,
        blogId?: string
    ): Promise<PostsWithPaginationViewModel> {

        const pageNumber = isNaN(Number(pageNumberQuery)) ? 1 : Number(pageNumberQuery)
        const pageSize = isNaN(Number(pageSizeQuery)) ? 10 : Number(pageSizeQuery)
        const sortBy = sortByQuery ? sortByQuery : 'createdAt'
        const sortDirection = sortDirectionQuery === 'asc' ? 1 : -1

        const skipPages: number = (pageNumber - 1) * pageSize


        // if(blogId) {
        //     const items = await postsCollection
        //         .find({blogId: blogId}, {projection: {_id: 0}})
        //         .sort({[sortBy]: sortDirection})
        //         .skip(skipPages)
        //         .limit(pageSize)
        //         .toArray()
        //     const totalCount = await postsCollection.find({blogId: blogId}).count({})
        //     const pageCount = Math.ceil(totalCount / pageSize)
        //
        //     return {
        //         pagesCount: pageCount,
        //         page: pageNumber,
        //         pageSize: pageSize,
        //         totalCount: totalCount,
        //         items: items
        //     }
        // }

        const items = await PostModel
            .find({}, {projection: {_id: 0}})
            .sort({[sortBy]: sortDirection})
            .skip(skipPages)
            .limit(pageSize)
        const totalCount = await PostModel.find({}).count({})
        const pageCount = Math.ceil(totalCount / pageSize)

        return {
            pagesCount: pageCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: items.map(i => ({
                id: i._id.toString(),
                title: i.title,
                shortDescription: i.shortDescription,
                content: i.content,
                blogId: i.blogId,
                blogName: i.blogName,
                createdAt: i.createdAt
            }))
        }
    }

    async findPostById(id: string): Promise<PostViewModel | null> {
        const post: PostViewModel | null = await PostModel.findOne({_id: id})
        if (post) {
            return post;
        } else {
            return null;
        }
    }

    async findPostByName(postName: string) {
        const foundPost = await PostModel.findOne({name: postName})
        return foundPost
    }

    async createPost(createdPost: Post): Promise<PostViewModel> {
        const postInstance = new PostModel()

        postInstance.title = createdPost.title,
            postInstance.shortDescription = createdPost.shortDescription,
            postInstance.content = createdPost.content,
            postInstance.blogId = createdPost.blogId,
            postInstance.blogName = createdPost.blogName,
            postInstance.createdAt = createdPost.createdAt

        const result = await postInstance.save()


        return {
            id: result._id.toString(),
            title: result.title,
            shortDescription: result.shortDescription,
            content: result.content,
            blogId: result.blogId,
            blogName: result.blogName,
            createdAt: result.createdAt
        }
    }
    async updatePost(postId: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean> {
        const result = await PostModel.updateOne({_id: postId}, {
            $set: {
                title: title,
                shortDescription: shortDescription,
                content: content,
                blogId: blogId
            }
        })
        return result.matchedCount === 1

    }
    async deletePost(id: string): Promise<boolean> {
        const result = await PostModel.deleteOne({_id: id})
        return result.deletedCount === 1;
    }
    async deleteAll() {
        const result = await PostModel.deleteMany({})
        return
    }
}

export const postsRepository = new PostsRepository()



// export const postsRepository = {
//     async findPosts(
//         pageNumberQuery: string,
//         pageSizeQuery: string,
//         sortByQuery: string,
//         sortDirectionQuery: string,
//         blogId?: string
//     ): Promise<PostsWithPaginationViewModel> {
//
//         const pageNumber = isNaN(Number(pageNumberQuery)) ? 1 : Number(pageNumberQuery)
//         const pageSize = isNaN(Number(pageSizeQuery)) ? 10 : Number(pageSizeQuery)
//         const sortBy = sortByQuery ? sortByQuery : 'createdAt'
//         const sortDirection = sortDirectionQuery === 'asc' ? 1 : -1
//
//         const skipPages: number = (pageNumber - 1) * pageSize
//
//
//         // if(blogId) {
//         //     const items = await postsCollection
//         //         .find({blogId: blogId}, {projection: {_id: 0}})
//         //         .sort({[sortBy]: sortDirection})
//         //         .skip(skipPages)
//         //         .limit(pageSize)
//         //         .toArray()
//         //     const totalCount = await postsCollection.find({blogId: blogId}).count({})
//         //     const pageCount = Math.ceil(totalCount / pageSize)
//         //
//         //     return {
//         //         pagesCount: pageCount,
//         //         page: pageNumber,
//         //         pageSize: pageSize,
//         //         totalCount: totalCount,
//         //         items: items
//         //     }
//         // }
//
//         const items = await PostModel
//             .find({}, {projection: {_id: 0}})
//             .sort({[sortBy]: sortDirection})
//             .skip(skipPages)
//             .limit(pageSize)
//         const totalCount = await PostModel.find({}).count({})
//         const pageCount = Math.ceil(totalCount / pageSize)
//
//         return {
//             pagesCount: pageCount,
//             page: pageNumber,
//             pageSize: pageSize,
//             totalCount: totalCount,
//             items: items.map(i => ({
//                 id: i._id.toString(),
//                 title: i.title,
//                 shortDescription: i.shortDescription,
//                 content: i.content,
//                 blogId: i.blogId,
//                 blogName: i.blogName,
//                 createdAt: i.createdAt
//             }))
//         }
//     },
//
//     async findPostById(id: string): Promise<PostViewModel | null> {
//         const post: PostViewModel | null = await PostModel.findOne({_id: id})
//         if (post) {
//             return post;
//         } else {
//             return null;
//         }
//     },
//
//     async findPostByName(postName: string) {
//         const foundPost = await PostModel.findOne({name: postName})
//         return foundPost
//     },
//
//     async createPost(createdPost: Post): Promise<PostViewModel> {
//         const postInstance = new PostModel()
//
//         postInstance.title = createdPost.title,
//             postInstance.shortDescription = createdPost.shortDescription,
//             postInstance.content = createdPost.content,
//             postInstance.blogId = createdPost.blogId,
//             postInstance.blogName = createdPost.blogName,
//             postInstance.createdAt = createdPost.createdAt
//
//         const result = await postInstance.save()
//
//
//         return {
//             id: result._id.toString(),
//             title: result.title,
//             shortDescription: result.shortDescription,
//             content: result.content,
//             blogId: result.blogId,
//             blogName: result.blogName,
//             createdAt: result.createdAt
//         }
//     },
//     async updatePost(postId: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean> {
//         const result = await PostModel.updateOne({_id: postId}, {
//             $set: {
//                 title: title,
//                 shortDescription: shortDescription,
//                 content: content,
//                 blogId: blogId
//             }
//         })
//         return result.matchedCount === 1
//
//     },
//     async deletePost(id: string): Promise<boolean> {
//         const result = await PostModel.deleteOne({_id: id})
//         return result.deletedCount === 1;
//     },
//     async deleteAll() {
//         const result = await PostModel.deleteMany({})
//         return
//     }
// }