import {BloggersType, PostsType, UserType} from "./types";
import {BloggerViewModel} from "../models/BloggerViewModel";
import {PostViewModel} from "../models/PostViewModel";
import {bloggersRepository} from "../repositories/bloggers-db-repository";
import {postsRepository} from "../repositories/posts-db-repository";
import {UserViewModel} from "../models/UserViewModel";
import {usersRepository} from "../repositories/users-db-repository";


export const HTTP_STATUSES = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,

    BAD_REQUEST_400: 400,
    NO_UNAUTHORIZED_401: 401,
    FORBIDDEN_403: 403,
    NOT_FOUND_404: 404
}

export const getBloggerViewModel = (blogger: BloggersType): BloggerViewModel => {
    return {
        id: blogger.id,
        name: blogger.name,
        description: blogger.description,
        websiteUrl: blogger.websiteUrl,
        createdAt: blogger.createdAt
    }
}
export const getPostsViewModel = (post: PostsType): PostViewModel => {
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
        id: user.id,
        login: user.login,
        email: user.email,
        createdAt: user.createdAt
    }
}
export const removeAllDataBase = async () => {
    await bloggersRepository.deleteAll()
    await postsRepository.deleteAll()
    await usersRepository.deleteAll()
    return
}