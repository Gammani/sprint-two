import {BlogType, PostType, UserType} from "./types";
import {BlogDBType, BlogViewModel} from "../models/BlogViewModel";
import {PostViewModel} from "../models/PostViewModel";
import {UserViewModel} from "../models/UserViewModel";
import {usersRepository} from "../repositories/users-db-repository";
import {commentsRepository} from "../repositories/comments-db-repository";
import {expiredTokensRepository} from "../repositories/expiredTokens-db-repository";
import {requestForApiRepository} from "../repositories/requestsForApi-db-repository";
import {devicesRepository} from "../repositories/devices-db-repository";
import {blogsRepository} from "../repositories/blogs-mongoose-repository";
import {postsRepository} from "../repositories/posts-mongoose-repository";


export const HTTP_STATUSES = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,

    BAD_REQUEST_400: 400,
    NO_UNAUTHORIZED_401: 401,
    FORBIDDEN_403: 403,
    NOT_FOUND_404: 404,
    TOO_MANY_REQUESTS_429: 429
}

export const getBlogViewModel = (blog: BlogDBType): BlogViewModel => {
    return {
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: false
    }
}
export const getPostsViewModel = (post: any): PostViewModel => {
    return {
        id: post.id,
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt
    }
}
export const getUsersViewModel = (user: UserType): UserViewModel => {
    return {
        id: user.accountData.id,
        login: user.accountData.login,
        email: user.accountData.email,
        createdAt: user.accountData.createdAt
    }
}
export const removeAllDataBase = async () => {
    await blogsRepository.deleteAll()
    await postsRepository.deleteAll()
    await usersRepository.deleteAll()
    await commentsRepository.deleteAll()
    await expiredTokensRepository.deleteAll()
    await requestForApiRepository.deleteAll()
    await devicesRepository.deleteAll()
    return
}

