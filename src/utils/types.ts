import {Request} from 'express'

export type RequestWithBody<T> = Request<{}, {}, T>
export type RequestWithQuery<T> = Request<{}, {}, {}, T>
export type RequestWithParams<T> = Request<T>
export type RequestWithParamsAndQuery<T, Y> = Request<T, {}, {}, Y>
export type RequestWithParamsAndBody<T, Y> = Request<T, {}, Y>



export type BloggersType = {
    id: string,
    name: string,
    description: string
    websiteUrl: string
    createdAt: string
}
export type PostsType = {
    id: string,
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
}
export type UserType = {
    id: string
    login: string
    email: string
    createdAt: string
    passwordHash: string
    passwordSalt: string
}
export type UserDBType = {
    _id: string
    id: string
    login: string
    email: string
    createdAt: string
    passwordHash: string
    passwordSalt: string
}
type CommentatorInfoType = {
    userId: string
    userLogin: string
}
export type CommentsType = {
    id: string
    content: string
    commentatorInfo: CommentatorInfoType
    createdAt: string
}

type ErrorsMessageType = {
    message: string
    field: string
}
export type ErrorsType = {
    errorsMessages: Array<ErrorsMessageType>
}