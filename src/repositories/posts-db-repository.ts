import {PostsWithPaginationViewModel, PostViewModel} from "../models/PostViewModel";
import {bloggersCollection, postsCollection} from "./db";
import {BloggerViewModel} from "../models/BloggerViewModel";
import {bloggersRepository} from "./bloggers-db-repository";

export const postsRepository = {
    // async findPosts(title: string | undefined | null): Promise<PostViewModel[]> {
    //     const filter: any = {}
    //
    //     if (title) {
    //         filter.title = {$regex: title}
    //     }
    //     return postsCollection.find(filter, {projection: {_id: 0}}).toArray();
    // },
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


        const items = await postsCollection
            .find({}, {projection: {_id: 0}})
            .sort({[sortBy]: sortDirection})
            .skip(skipPages)
            .limit(pageSize)
            .toArray()
        const totalCount = await postsCollection.find({}).count({})
        const pageCount = Math.ceil(totalCount / pageSize)

        return {
            pagesCount: pageCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: items
        }
    },
    async findPostById(id: string): Promise<PostViewModel | null> {
        const post: PostViewModel | null = await postsCollection.findOne({id: id}, {projection: {_id: 0}})
        if (post) {
            return post;
        } else {
            return null;
        }
    },
    async createPost(createdPost: PostViewModel): Promise<PostViewModel | null> {
        const result = await postsCollection.insertOne({...createdPost})
        return createdPost;
    },
    async updatePost(postId: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean> {
        const result = await postsCollection.updateOne({id: postId}, {
            $set: {
                title: title,
                shortDescription: shortDescription,
                content: content,
                blogId: blogId
            }
        })
        return result.matchedCount === 1

    },
    async deletePost(id: string): Promise<boolean> {
        const result = await postsCollection.deleteOne({id: id})
        return result.deletedCount === 1;
    },
    async deleteAll() {
        const result = await postsCollection.deleteMany({})
        return
    }
}