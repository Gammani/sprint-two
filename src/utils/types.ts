import {ObjectId, WithId} from "mongodb";
import {NewestLikesViewModel} from "../models/PostViewModel";


// LIKES

export enum LikeStatus {
    Like = 'Like',
    Dislike = 'Dislike',
    None = "None"
}

export type LikesInfoType = {
    likesCount: number
    dislikesCount: number
    myStatus: LikeStatus
}

export type NewestLikesType = {
    addedAt: string
    userId: ObjectId
    login: string
}

export type ExtendedLikesInfoType = {
    likesCount: number
    dislikesCount: number
    myStatus: LikeStatus
    newestLikes: NewestLikesType[]
}


// Comment LIKE

// export const LikeStatus = {
//     LIKE: 'Like' as const,
//     DISLIKE: 'Dislike' as const,
//     NONE: 'None' as const
// }

export type CommentLikeDbType = WithId<{
    userId: ObjectId
    login: string
    blogId: ObjectId
    postId: ObjectId
    commentId: ObjectId
    likeStatus: LikeStatus
    addedAt: Date
    lastUpdate: Date
}>

export class CommentLike {
    constructor(
        public _id: ObjectId,
        public userId: ObjectId,
        public login: string,
        public blogId: ObjectId,
        public postId: ObjectId,
        public commentId: ObjectId,
        public likeStatus: LikeStatus,
        public addedAt: Date,
        public lastUpdate: Date
    ) {
    }
}


// post LIKE

export type PostLikeDbType = WithId<{
    userId: ObjectId
    login: string
    blogId: ObjectId
    postId: ObjectId
    likeStatus: LikeStatus
    addedAt: string
    lastUpdate: string
}>

export class PostLike {
    constructor(
        public _id: ObjectId,
        public userId: ObjectId,
        public login: string,
        public blogId: ObjectId,
        public postId: ObjectId,
        public commentId: ObjectId,
        public likeStatus: LikeStatus,
        public addedAt: string,
        public lastUpdate: string
    ) {
    }
}

export type customFilteredPostLikesType = {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
    extendedLikesInfo: {
        likesCount: number
        dislikesCount: number
        myStatus: LikeStatus
        newestLikes: NewestLikesViewModel[]
    }
}

// Blog
type BlogType = {
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    isMembership: boolean
}
export type BlogDBType = WithId<BlogType>

export class Blog {
    constructor(
        public _id: ObjectId,
        public name: string,
        public description: string,
        public websiteUrl: string,
        public createdAt: string,
        public isMembership: boolean
    ) {
    }
}


// Post
export type PostDbType = WithId<{
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
    extendedLikesInfo: ExtendedLikesInfoType
}>

export class Post {
    constructor(
        public _id: ObjectId,
        public title: string,
        public shortDescription: string,
        public content: string,
        public blogId: string,
        public blogName: string,
        public createdAt: string,
        public extendedLikesInfo: ExtendedLikesInfoType
    ) {
    }
}


// Expired Token
export class ExpiredToken {
    constructor(
        public userId: string,
        public token: string
    ) {
    }
}

export type ExpiredTokenType = {
    userId: string
    refreshToken: string
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
    recoveryCode: string
}
export type EmailConfirmationType = {
    confirmationCode: string
    expirationDate: Date
    isConfirmed: boolean
}

type UserType = {
    accountData: AccountDataType
    emailConfirmation: EmailConfirmationType
}

export type UserTypeDbModel = WithId<UserType>

export class User {
    constructor(
        public _id: ObjectId,
        public accountData: AccountDataType,
        public emailConfirmation: EmailConfirmationType
    ) {
    }
}

// Comment
export type CommentatorInfoType = {
    userId: string
    userLogin: string
}


export type CommentDBType = WithId<{
    content: string
    commentatorInfo: CommentatorInfoType
    createdAt: string
    _postId: ObjectId
    _blogId: ObjectId
    likesInfo: LikesInfoType
}>

export class Comment {
    constructor(
        public content: string,
        public commentatorInfo: CommentatorInfoType,
        public createdAt: string,
        public _postId: ObjectId,
        public _blogId: ObjectId,
        public likesInfo: LikesInfoType
    ) {
    }
}

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


export class Device {
    constructor(
        public _id: ObjectId,
        public userId: string,
        public ip: string,
        public title: string,
        public lastActiveDate: Date,
    ) {
    }
}

type DeviceType = {
    userId: string
    ip: string
    title: string
    lastActiveDate: Date
}
export type DeviceDbType = WithId<DeviceType>

