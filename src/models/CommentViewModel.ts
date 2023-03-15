type CommentatorInfo = {
    userId: string
    userLogin: string
}
export type CommentViewModel = {
    id: string
    content: string
    commentatorInfo: CommentatorInfo
    createdAt: string
}
export type CommentDbViewModel = {
    id: string
    content: string
    commentatorInfo: CommentatorInfo
    createdAt: string
    _postId: string
}

export type CommentsWithPaginationViewModel = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: CommentViewModel[]
}