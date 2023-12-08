import {BlogViewModel} from "../api/viewModels/BlogViewModel";
import {BlogsRepository} from "../repositories/blogs-mongoose-repository";
import {PostsRepository} from "../repositories/posts-mongoose-repository";
import {UsersRepository} from "../repositories/users-mongoose-repository";
import {CommentsRepository} from "../repositories/comments-mongoose-repository";
import {RequestForApiRepository} from "../repositories/requestForApi-mongoose-repository";
import {ExpiredTokenRepository} from "../repositories/expiredToken-mongoose-repository";
import {DevicesRepository} from "../repositories/devices-mongoose-repository";
import {BlogDBType} from "./types";
import {LikeMongooseRepository} from "../repositories/like-mongoose-repository";


const blogsRepository = new BlogsRepository()
const postsRepository = new PostsRepository()
const usersRepository = new UsersRepository()
const commentsRepository = new CommentsRepository()
const expiredTokensRepository = new ExpiredTokenRepository()
const requestForApiRepository = new RequestForApiRepository()
const devicesRepository = new DevicesRepository()
const likeMongooseRepository = new LikeMongooseRepository()


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
        isMembership: blog.isMembership
    }
}
// export const getPostsViewModel = (post: PostDBType): PostViewModel => {
//     return {
//         id: post._id.toString(),
//         title: post.title,
//         shortDescription: post.shortDescription,
//         content: post.content,
//         blogId: post.blogId,
//         blogName: post.blogName,
//         createdAt: post.createdAt
//     }
// }
export const removeAllDataBase = async () => {
    await blogsRepository.deleteAll()
    await postsRepository.deleteAll()
    await usersRepository.deleteAll()
    await commentsRepository.deleteAll()
    await expiredTokensRepository.deleteAll()
    await requestForApiRepository.deleteAll()
    await devicesRepository.deleteAll()
    await likeMongooseRepository.deleteAll()
    return
}

