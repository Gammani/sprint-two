import {Request} from 'express'
import {WithId} from "mongodb";

export type RequestWithBody<T> = Request<{}, {}, T>
export type RequestWithQuery<T> = Request<{}, {}, {}, T>
export type RequestWithParams<T> = Request<T>
export type RequestWithParamsAndQuery<T, Y> = Request<T, {}, {}, Y>
export type RequestWithParamsAndBody<T, Y> = Request<T, {}, Y>


export type BlogType = {
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    isMembership: boolean
}
export type PostType = {
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
}
export type ExpiredTokenType = {
    userId: string
    token: string
}
// export type UserType = {
//     id: string
//     login: string
//     email: string
//     createdAt: string
//     passwordHash: string
//     passwordSalt: string
// }
export type AccountDataType = {
    login: string
    email: string
    createdAt: string
    passwordHash: string
}
export type EmailConfirmationType = {
    confirmationCode: string
    expirationDate: string
    isConfirmed: boolean
}
export type UserTypeDbModel = WithId<User>

export type User = {
    accountData: AccountDataType
    emailConfirmation: EmailConfirmationType
}

export type CommentatorInfoType = {
    userId: string
    userLogin: string
}
export type CommentType = {
    content: string
    commentatorInfo: CommentatorInfoType
    createdAt: string
    _postId: string
}
export type CommentDBType = WithId<{
    content: string
    commentatorInfo: CommentatorInfoType
    createdAt: string
    _postId: string
}>

type ErrorsMessageType = {
    message: string
    field: string
}
export type ErrorsType = {
    errorsMessages: Array<ErrorsMessageType>
}
export type RequestForApiType = {
    IP: string
    URL: string
    date: Date
}
export type DeviceType = {
    userId: string
    ip: string
    title: string
    lastActiveDate: Date
    deviceId: string
}