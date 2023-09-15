import {WithId} from "mongodb";

export type PostViewModel = {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
}
export type PostDBType = WithId<{
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
}>
export type PostsWithPaginationViewModel = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: PostViewModel[]
}