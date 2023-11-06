import {ObjectId, WithId} from "mongodb";


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
}>

export class Post {
    constructor(
        public _id: ObjectId,
        public title: string,
        public shortDescription: string,
        public content: string,
        public blogId: string,
        public blogName: string,
        public createdAt: string
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

export type CommentatorInfoType = {
    userId: string
    userLogin: string
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
