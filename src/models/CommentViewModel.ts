export type CommentViewModel = {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
}

export type CommentsWithPaginationViewModel = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: CommentViewModel[]
}