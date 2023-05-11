import {NextFunction, Request, Response} from "express";
import {CustomValidator, validationResult} from "express-validator";
import {ErrorsType} from "../utils/types";
import {BloggerViewModel} from "../models/BloggerViewModel";
import {bloggersRepository} from "../repositories/bloggers-db-repository";
import {HTTP_STATUSES} from "../utils/utils";
import {usersRepository} from "../repositories/users-db-repository";


export const checkedValidation = (req: Request, res: Response, next: NextFunction) => {
    const error = validationResult(req).mapped();
    let errors: ErrorsType = {errorsMessages: []}
    Object.keys(error).forEach(a => errors.errorsMessages.push({message: `не валидное поле ${error[a].param}`, field: error[a].param}))

    if(errors.errorsMessages.length > 0) {
        res.status(HTTP_STATUSES.BAD_REQUEST_400).send(errors)
    } else {
        next()
    }
}
export const checkedExistsForLoginOrEmail = async (req: Request, res: Response, next: NextFunction) => {
    let errors: ErrorsType = {errorsMessages: []}
    const foundUserByLogin = await usersRepository.findUserByLogin(req.body.login)
    if(foundUserByLogin) {
        errors.errorsMessages.push({message: `не валидное поле login`, field: 'login'})
    }
    const foundUserByEmail = await usersRepository.findUserByEmail(req.body.email)
    if(foundUserByEmail) {
        errors.errorsMessages.push({message: `не валидное поле email`, field: 'email'})
    }
    if(errors.errorsMessages.length > 0) {
        res.status(HTTP_STATUSES.BAD_REQUEST_400).send(errors)
    } else {
        next()
    }
}

export const isValidId: CustomValidator = async (blogId) => {
    const foundBlogger: BloggerViewModel | null = await bloggersRepository.findBloggerById(blogId)
    if(!foundBlogger) {
        return Promise.reject('blogId не валидный')
    } else {
        return true
    }
}