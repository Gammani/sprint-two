import {BlogsRepository} from "./repositories/blogs-mongoose-repository";
import {BlogsQueryRepository} from "./repositories/blogs-query-repository";
import {UsersRepository} from "./repositories/users-mongoose-repository";
import {UsersQueryRepository} from "./repositories/users-query-mongoose-repository";
import {PostsRepository} from "./repositories/posts-mongoose-repository";
import {PostsQueryRepository} from "./repositories/posts-query-mongoose-repository";
import {CommentsRepository} from "./repositories/comments-mongoose-repository";
import {DevicesRepository} from "./repositories/devices-mongoose-repository";
import {ExpiredTokenRepository} from "./repositories/expiredToken-mongoose-repository";
import {RequestForApiRepository} from "./repositories/requestForApi-mongoose-repository";
import {BlogsService} from "./application/blogs-service";
import {UsersService} from "./application/users-service";
import {AuthService} from "./application/auth-service";
import {PostsService} from "./application/posts-service";
import {CommentsService} from "./application/comments-service";
import {JwtService} from "./application/jwt-service";
import {SecurityDevicesService} from "./application/sequrity-devices-service";
import {AuthController} from "./api/controllers/authController";
import {BlogController} from "./api/controllers/blogController";
import {UsersController} from "./api/controllers/userController";
import {PostsController} from "./api/controllers/postController";
import {CommentsController} from "./api/controllers/commentController";
import {SecurityDevicesController} from "./api/controllers/securityDevicesController";
import {CommentsQueryRepository} from "./repositories/comments-query-repository";
import {LikeStatusService} from "./application/like-status-service";
import {LikeMongooseRepository} from "./repositories/like-mongoose-repository";

export const usersRepository = new UsersRepository()
export const blogsRepository = new BlogsRepository()
const blogsQueryRepository = new BlogsQueryRepository()
const usersQueryRepository = new UsersQueryRepository()
const postsRepository = new PostsRepository()
const postsQueryRepository = new PostsQueryRepository()
const commentsRepository = new CommentsRepository()
const commentsQueryRepository = new CommentsQueryRepository()
const devicesRepository = new DevicesRepository()
export const expiredTokenRepository = new ExpiredTokenRepository()
const requestForApiRepository = new RequestForApiRepository()
export const likeMongooseRepository = new LikeMongooseRepository()

const authService = new AuthService(usersRepository)
export const usersService = new UsersService(usersRepository, devicesRepository)
const blogService = new BlogsService(blogsRepository)
const postsService = new PostsService(postsRepository, blogsRepository)
export const commentsService = new CommentsService(commentsRepository, postsRepository, commentsQueryRepository)
export const likeStatusService = new LikeStatusService()
export const jwtService = new JwtService(expiredTokenRepository, devicesRepository)
export const securityDevicesService = new SecurityDevicesService(devicesRepository)

export const authController = new AuthController(usersService, jwtService, authService, securityDevicesService)
export const usersController = new UsersController(usersService, usersQueryRepository)
export const blogController = new BlogController(blogsQueryRepository, blogService, postsService)
export const postsController = new PostsController(postsService, commentsService, postsQueryRepository, commentsQueryRepository)
export const commentsController = new CommentsController(commentsService, commentsQueryRepository, likeStatusService)
export const securityDevicesController = new SecurityDevicesController(securityDevicesService)