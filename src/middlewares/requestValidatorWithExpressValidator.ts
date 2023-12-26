import {NextFunction, Request, Response} from "express";
import {body, CustomValidator, validationResult} from "express-validator";
import {CommentDBType, ErrorsType, PostDbType} from "../utils/types";
import {BlogViewModel} from "../api/viewModels/BlogViewModel";
import {HTTP_STATUSES} from "../utils/utils";
import {JwtService} from "../application/jwt-service";
import {UsersService} from "../application/users-service";
import {SecurityDevicesService} from "../application/sequrity-devices-service";
import {BlogsRepository} from "../repositories/blogs-mongoose-repository";
import {UsersRepository} from "../repositories/users-mongoose-repository";
import {ExpiredTokenRepository} from "../repositories/expiredToken-mongoose-repository";
import {container} from "../composition-root";
import {CommentLikeStatusService} from "../application/comment-like-status-service";
import {CommentsService} from "../application/comments-service";
import {PostsService} from "../application/posts-service";


const blogsRepository = container.resolve(BlogsRepository)
const expiredTokenRepository = container.resolve(ExpiredTokenRepository)
const jwtService = container.resolve(JwtService)
const securityDevicesService = container.resolve(SecurityDevicesService)
const commentLikeStatusService = container.resolve(CommentLikeStatusService)
const usersRepository = container.resolve(UsersRepository)
const usersService = container.resolve(UsersService)
const commentsService = container.resolve(CommentsService)
const postsService = container.resolve(PostsService)


export const authRegistrationValidation = [
    body('login').isString().trim().isLength({min: 3, max: 10}).notEmpty().matches(/^[a-zA-Z0-9_-]*$/),
    body('password').isString().trim().isLength({min: 6, max: 20}).notEmpty().exists(),
    body('email').isString().trim().notEmpty().matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).exists()
]
export const authLoginValidation = [
    body('loginOrEmail').isString().trim().notEmpty(),
    body('password').isString().trim().notEmpty(),
]
export const authRegistrationConfirmationValidation = [
    body('code').isString().trim().notEmpty(),
]
export const authNewPasswordValidation = [
    body('newPassword').isString().trim().isLength({min: 6, max: 20}).notEmpty().exists(),
    body('recoveryCode').isString().trim().notEmpty()
]
export const authRegistrationEmailResendingValidation = [
    body('email').isString().trim().notEmpty().matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/),
]

export const blogValidation = [
    body('name').isString().trim().isLength({max: 15}).notEmpty(),
    body('description').isString().trim().isLength({max: 500}).notEmpty(),
    body('websiteUrl').isString().trim().isLength({max: 100}).matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/)
]


export const isValidId: CustomValidator = async (blogId) => {
    const foundBlogger: BlogViewModel | null = await blogsRepository.findBlogById(blogId)
    if (!foundBlogger) {
        return Promise.reject('blogId не валидный')
    } else {
        return true
    }
}

export const postValidation = [
    body('title').isString().trim().notEmpty().isLength({max: 30}),
    body('shortDescription').isString().trim().notEmpty().isLength({max: 100}),
    body('content').isString().trim().notEmpty().isLength({max: 1000}),
    body('blogId').custom(isValidId)
]

export const createPostWithoutBlogIdValidation = [
    body('title').isString().trim().notEmpty().isLength({max: 30}),
    body('shortDescription').isString().trim().notEmpty().isLength({max: 100}),
    body('content').isString().trim().notEmpty().isLength({max: 1000})
]

export const commentValidation = [
    body('content').isString().trim().notEmpty().isLength({max: 300, min: 20})
]

export const commentLikeStatusValidation = async (req: Request, res: Response, next: NextFunction) => {
    debugger
    if (!req.body.likeStatus) {
        res.status(HTTP_STATUSES.BAD_REQUEST_400).send(
            {
                errorsMessages: [
                    {
                        message: "Не валидное поле",
                        field: "likeStatus"
                    }
                ]
            }
        )
        return
    }
    debugger
    if (req.body.likeStatus !== 'None' && req.body.likeStatus !== 'Like' && req.body.likeStatus !== 'Dislike') {
        res.status(HTTP_STATUSES.BAD_REQUEST_400).send(
            {
                errorsMessages: [
                    {
                        message: "Не валидное поле",
                        field: "likeStatus"
                    }
                ]
            }
        )
        return
    }
    debugger
    const foundComment: CommentDBType | null = await commentsService.findCommentById(req.params.commentId)
    if (foundComment) {
        // // должно быть экшнен какой то типа снять лайл если лайк
        // if(foundComment.likesInfo.myStatus === req.body.likeStatus) {
        //     res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        // } else {
        //     next()
        // }
        next()

    } else {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }
}

export const postLikeStatusValidation = async (req: Request, res: Response, next: NextFunction) => {
    debugger
    if (!req.body.likeStatus) {
        res.status(HTTP_STATUSES.BAD_REQUEST_400).send(
            {
                errorsMessages: [
                    {
                        message: "Не валидное поле",
                        field: "likeStatus"
                    }
                ]
            }
        )
        return
    }
    debugger
    if (req.body.likeStatus !== 'None' && req.body.likeStatus !== 'Like' && req.body.likeStatus !== 'Dislike') {
        res.status(HTTP_STATUSES.BAD_REQUEST_400).send(
            {
                errorsMessages: [
                    {
                        message: "Не валидное поле",
                        field: "likeStatus"
                    }
                ]
            }
        )
        return
    }
    debugger
    const foundPost: PostDbType | null = await postsService.findPostById(req.params.postId)
    if (foundPost) {
        // // должно быть экшнен какой то типа снять лайл если лайк
        // if(foundComment.likesInfo.myStatus === req.body.likeStatus) {
        //     res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        // } else {
        //     next()
        // }
        next()

    } else {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }
}

export const checkedValidation = (req: Request, res: Response, next: NextFunction) => {
    const error = validationResult(req).mapped();
    let errors: ErrorsType = {errorsMessages: []}
    Object.keys(error).forEach(a => errors.errorsMessages.push({
        message: `не валидное поле ${error[a].param}`,
        field: error[a].param
    }))

    if (errors.errorsMessages.length > 0) {
        res.status(HTTP_STATUSES.BAD_REQUEST_400).send(errors)
    } else {
        next()
    }
}
export const checkedExistsForLoginOrEmail = async (req: Request, res: Response, next: NextFunction) => {
    let errors: ErrorsType = {errorsMessages: []}
    const foundUserByLogin = await usersRepository.findUserByLogin(req.body.login)
    if (foundUserByLogin) {
        errors.errorsMessages.push({message: `не валидное поле login`, field: 'login'})
    }
    const foundUserByEmail = await usersRepository.findUserByEmail(req.body.email)
    if (foundUserByEmail) {
        errors.errorsMessages.push({message: `не валидное поле email`, field: 'email'})
    }
    if (errors.errorsMessages.length > 0) {
        res.status(HTTP_STATUSES.BAD_REQUEST_400).send(errors)
    } else {
        next()
    }
}
export const checkedConfirmedEmail = async (req: Request, res: Response, next: NextFunction) => {
    let errors: ErrorsType = {errorsMessages: []}
    const foundUser = await usersRepository.findUserByEmail(req.body.email)
    if (!foundUser) {
        errors.errorsMessages.push({message: `не валидное поле email`, field: 'email'})
    }
    if (foundUser?.emailConfirmation.isConfirmed) {
        errors.errorsMessages.push({message: `не валидное поле email`, field: 'email'})
    }
    if (errors.errorsMessages.length > 0) {
        res.status(HTTP_STATUSES.BAD_REQUEST_400).send(errors)
    } else {
        next()
    }
}
export const checkedEmail = async (req: Request, res: Response, next: NextFunction) => {
    const error = validationResult(req).mapped();
    let errors: ErrorsType = {errorsMessages: []}
    Object.keys(error).forEach(a => errors.errorsMessages.push({
        message: `не валидное поле ${error[a].param}`,
        field: error[a].param
    }))

    if (errors.errorsMessages.length > 0) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
    } else {
        next()
    }
}

export const checkAndUpdateRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
    debugger
    if (!req.cookies.refreshToken) {
        res.sendStatus(HTTP_STATUSES.NO_UNAUTHORIZED_401)
        return
    }
    debugger

    const expiredToken = await expiredTokenRepository.findToken(req.cookies.refreshToken)
    if (expiredToken) {
        res.sendStatus(HTTP_STATUSES.NO_UNAUTHORIZED_401)
        return
    }
    debugger
    const refreshToken = req.cookies.refreshToken
    // jwt.verify(refreshToken, settings.JWT_SECRET, function(err: any, decoded: any) {
    //     if (err) {
    //         /*
    //           err = {
    //             name: 'TokenExpiredError',
    //             message: 'jwt expired',
    //             expiredAt: 1408621000
    //           }
    //         */
    //     }
    // });
    debugger
    const isExpiredToken = await expiredTokenRepository.isExpiredToken(refreshToken)
    if (isExpiredToken) {
        res.sendStatus(HTTP_STATUSES.NO_UNAUTHORIZED_401)
        return
    }
    debugger
    const deviceId: string | null = await jwtService.getDeviceIdByRefreshToken(refreshToken)
    if (deviceId) {
        debugger
        // const UserId: string | undefined = await securityDevicesService.findUserIdByDeviceId(deviceId)
        const foundUser = await usersService.findUserByDeviceId(deviceId)
        await securityDevicesService.findAndUpdateDeviceAfterRefresh(deviceId)
        debugger
        expiredTokenRepository.addTokenToDB(foundUser!._id.toString(), refreshToken)
        req.user = {
            email: foundUser!.accountData.email,
            login: foundUser!.accountData.login,
            userId: foundUser!._id.toString(),
            deviceId: deviceId
        }
        next()
    } else {
        res.send(HTTP_STATUSES.NO_UNAUTHORIZED_401)
        return
    }
}
export const checkAndRemoveRefreshTokenById = async (req: Request, res: Response, next: NextFunction) => {
    debugger
    const userIdFromURI = await securityDevicesService.findUserIdByDeviceId(req.params.deviceId)  // левый юзер
    if (!userIdFromURI) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }
    if (!req.cookies.refreshToken) {
        res.sendStatus(HTTP_STATUSES.NO_UNAUTHORIZED_401)
        return
    }
    debugger

    if (await expiredTokenRepository.findToken(req.cookies.refreshToken)) {
        res.sendStatus(HTTP_STATUSES.NO_UNAUTHORIZED_401)
        return
    }
    debugger
    const refreshToken = req.cookies.refreshToken
    debugger
    const isExpiredToken = await expiredTokenRepository.isExpiredToken(refreshToken)
    if (isExpiredToken) {
        res.sendStatus(HTTP_STATUSES.NO_UNAUTHORIZED_401)
        return
    }
    debugger
    const deviceId: string | null = await jwtService.getDeviceIdByRefreshToken(refreshToken)
    // if(deviceId !== req.params.deviceId) {
    //     res.sendStatus(HTTP_STATUSES.FORBIDDEN_403)
    //     return
    // }
    if (deviceId) {
        debugger
        // const UserId: string | undefined = await securityDevicesService.findUserIdByDeviceId(deviceId)
        const foundUser = await usersService.findUserByDeviceId(deviceId)
        debugger
        if (foundUser) {
            const isFoundDeviceFromUserId = await securityDevicesService.findDeviceFromUserId(deviceId, userIdFromURI)
            // мне приходит токен а в парамс приходит deviceId, нужно узнать является ли deviceId тому же юзеру что и токен. DeviceId
            // вытащили из токена.
            // токен который указан в id

            if (isFoundDeviceFromUserId) {
                // expiredTokensRepository.addTokenToDB(foundUser.accountData.id, refreshToken) КОММЕНТ
                console.log(foundUser)
                req.user = {
                    email: foundUser.accountData.email,
                    login: foundUser.accountData.login,
                    userId: foundUser._id.toString(),
                    deviceId: req.params.deviceId
                }
                next()
            } else {
                res.send(HTTP_STATUSES.FORBIDDEN_403)
                return
            }

        } else {
            res.send(HTTP_STATUSES.FORBIDDEN_403)
            return
        }

    } else {
        res.send(HTTP_STATUSES.NO_UNAUTHORIZED_401)
        return
    }
}


export const checkRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
    debugger
    if (!req.cookies.refreshToken) {
        res.sendStatus(HTTP_STATUSES.NO_UNAUTHORIZED_401)
        return
    }
    debugger
    if (await expiredTokenRepository.findToken(req.cookies.refreshToken)) {
        res.sendStatus(HTTP_STATUSES.NO_UNAUTHORIZED_401)
        return
    }
    debugger
    const token = req.cookies.refreshToken
    console.log("token = ", token)

    debugger
    const isExpiredToken = await expiredTokenRepository.isExpiredToken(token)
    if (isExpiredToken) {
        res.sendStatus(HTTP_STATUSES.NO_UNAUTHORIZED_401)
        return
    }
    debugger
    const deviceId: string | null = await jwtService.getDeviceIdByRefreshToken(token)
    if (deviceId) {
        debugger
        // const UserId: string | undefined = await securityDevicesService.findUserIdByDeviceId(deviceId)
        const foundUser = await usersService.findUserByDeviceId(deviceId)
        debugger
        console.log(foundUser)
        req.user = {
            email: foundUser!.accountData.email,
            login: foundUser!.accountData.login,
            userId: foundUser!._id.toString(),
            deviceId: deviceId
        }
        next()
    } else {
        res.send(HTTP_STATUSES.NO_UNAUTHORIZED_401)
        return
    }
}