import {WithId} from "mongodb";

export type BlogViewModel = {
    id: string
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    isMembership: boolean
}
export type BlogDBType = WithId<{
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    isMembership: boolean
}>

export type BloggerWithPaginationViewModel = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: BlogViewModel[]
}