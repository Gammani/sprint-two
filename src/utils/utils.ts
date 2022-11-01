import {BloggersType, PostsType} from "./types";
import {BloggerViewModel} from "../models/BloggerViewModel";
import {PostViewModel} from "../models/PostViewModel";


export const HTTP_STATUSES = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,

    BAD_REQUEST_400: 400,
    NO_UNAUTHORIZED_401: 401,
    NOT_FOUND_404: 404
}

export const getBloggerViewModel = (blogger: BloggersType): BloggerViewModel => {
    return {
        id: blogger.id,
        name: blogger.name,
        youtubeUrl: blogger.youtubeUrl
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
    }
}