import {LikeStatus} from "../utils/types";


export type NewestLikesViewModel = {
    addedAt: string
    userId: string
    login: string
}
export type ExtendedLikesInfoViewModel = {
    likesCount: number
    dislikesCount: number
    myStatus: LikeStatus
    newestLikes: NewestLikesViewModel[]
}
export type PostViewModel = {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
    extendedLikesInfo: ExtendedLikesInfoViewModel
}
export type PostsWithPaginationViewModel = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: PostViewModel[]
}