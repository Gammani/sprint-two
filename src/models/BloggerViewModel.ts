export type BloggerViewModel = {
    id: string
    name: string
    description: string
    websiteUrl: string
    createdAt: string
}

export type BloggerWithPaginationViewModel = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: BloggerViewModel[]
}