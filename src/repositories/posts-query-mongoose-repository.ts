import {injectable} from "inversify";
import {PostModel} from "../mongo/post/post.model";
import {customFilteredPostLikesType, LikeStatus, PostDbType, PostLikeDbType} from "../utils/types";
import {PostsWithPaginationViewModel, PostViewModel} from "../models/PostViewModel";
import {PostLikeModel} from "../mongo/llikes/postLikeModel";


@injectable()
export class PostsQueryRepository {
    async findPosts(
        pageNumberQuery: string,
        pageSizeQuery: string,
        sortByQuery: string,
        sortDirectionQuery: string,
        userId?: string,
        blogId?: string): Promise<PostsWithPaginationViewModel> {

        const pageNumber = isNaN(Number(pageNumberQuery)) ? 1 : Number(pageNumberQuery)
        const pageSize = isNaN(Number(pageSizeQuery)) ? 10 : Number(pageSizeQuery)
        const sortBy = sortByQuery ? sortByQuery : 'createdAt'
        const sortDirection = sortDirectionQuery === 'asc' ? 1 : -1

        const skipPages: number = (pageNumber - 1) * pageSize

        // const totalCount = await PostModel.find({}).count({})
        // const pageCount = Math.ceil(totalCount / pageSize)
        let totalCount
        let pageCount

        let items: PostDbType[]
        console.log("blogId = ", blogId)

        if(blogId) {
            totalCount = await PostModel.find({blogId: blogId}).count({})
            pageCount = Math.ceil(totalCount / pageSize)
            items = await PostModel
                .find({blogId: blogId})
                .sort({[sortBy]: sortDirection})
                .skip(skipPages)
                .limit(pageSize)
        } else {
            totalCount = await PostModel.find({}).count({})
            pageCount = Math.ceil(totalCount / pageSize)
            items = await PostModel
                .find({})
                .sort({[sortBy]: sortDirection})
                .skip(skipPages)
                .limit(pageSize)
        }


        const result = await Promise.all(items.map(item => this.getExtendedLikesInfo(item, userId)))
        const filteredResult = result.filter(r => r !== undefined) as customFilteredPostLikesType[]

        return {
            pagesCount: pageCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: filteredResult.map(r => ({
                id: r.id.toString(),
                title: r.title,
                shortDescription: r.shortDescription,
                content: r.content,
                blogId: r.blogId,
                blogName: r.blogName,
                createdAt: r.createdAt,
                extendedLikesInfo: {
                    likesCount: r.extendedLikesInfo.likesCount,
                    dislikesCount: r.extendedLikesInfo.dislikesCount,
                    myStatus: r.extendedLikesInfo.myStatus,
                    newestLikes: r.extendedLikesInfo.newestLikes
                }
            }))
        }
    }

    async findPostByTitle(title: string): Promise<PostDbType | null> {
        const post: PostDbType | null = await PostModel.findOne({title: title})
        if (post) {
            return post
        } else {
            return null
        }
    }

    async findPostById(id: string, userId?: string): Promise<PostViewModel | null> {
        const foundPost: PostDbType | null = await PostModel.findOne({_id: id})
        if (foundPost) {
            const likesCount = await PostLikeModel.find({postId: id, likeStatus: LikeStatus.Like}).count({})
            const dislikesCount = await PostLikeModel.find({postId: id, likeStatus: LikeStatus.Dislike}).count({})
            const myStatus = await PostLikeModel.findOne({postId: id, userId})
            const newestLikes = await PostLikeModel.find({postId: id, likeStatus: LikeStatus.Like})
                .sort({createdAt: -1, _id: -1})
                .limit(3)

            return {
                id: foundPost._id.toString(),
                title: foundPost.title,
                shortDescription: foundPost.shortDescription,
                content: foundPost.content,
                blogId: foundPost.blogId,
                blogName: foundPost.blogName,
                createdAt: foundPost.createdAt,
                extendedLikesInfo: {
                    likesCount: likesCount,
                    dislikesCount: dislikesCount,
                    myStatus: myStatus ? myStatus.likeStatus : LikeStatus.None,
                    newestLikes: newestLikes.map(nl => ({
                        addedAt: nl.addedAt.toString(),
                        userId: nl.userId.toString(),
                        login: nl.login
                    }))
                }
            }

        } else {
            return null
        }
    }


    async getExtendedLikesInfo(post: PostDbType, userId?: string): Promise<customFilteredPostLikesType | undefined> {
        try {

            let myStatus: PostLikeDbType | null = null

            if (userId) {
                myStatus = await PostLikeModel.findOne({postId: post._id, userId})
            }


            const newestLikes = await PostLikeModel.find({postId: post._id, likeStatus: LikeStatus.Like})
                .sort({createdAt: -1, _id: -1})
                .limit(3)
            const likesCount = await PostLikeModel.find({postId: post._id, likeStatus: LikeStatus.Like}).count({})
            const dislikesCount = await PostLikeModel.find({postId: post._id, likeStatus: LikeStatus.Dislike}).count({})

            // .countDocuments
            // const likesCount = await PostLikeModel.countDocuments({ postId: post._id, likeStatus: LikeStatus.Like }).exec()
            // const dislikesCount = await PostLikeModel.countDocuments({ postId: post._id, likeStatus: LikeStatus.Dislike }).exec()

            const newestLikesInfo = newestLikes.map((nl: PostLikeDbType) => ({
                addedAt: nl.addedAt.toString(),
                userId: nl.userId.toString(),
                login: nl.login
            }))

            return {
                id: post._id.toString(),
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                blogId: post.blogId,
                blogName: post.blogName,
                createdAt: post.createdAt,
                extendedLikesInfo: {
                    likesCount: likesCount,
                    dislikesCount: dislikesCount,
                    myStatus: myStatus ? myStatus.likeStatus : LikeStatus.None,
                    newestLikes: newestLikesInfo
                }
            }
        } catch (error) {
            console.log(error)
        }
    }
}