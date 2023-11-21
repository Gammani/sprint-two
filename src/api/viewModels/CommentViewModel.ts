import {LikesInfoType} from "../../utils/types";

type CommentatorInfoType = {
    userId: string
    userLogin: string
}

export type CommentViewModel = {
    id: string
    content: string
    commentatorInfo: CommentatorInfoType
    createdAt: string
    likesInfo: LikesInfoType
}

export type CommentsWithPaginationViewModel = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: CommentViewModel[]
}