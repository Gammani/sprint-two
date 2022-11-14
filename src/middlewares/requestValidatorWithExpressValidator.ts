import {NextFunction, Request, Response} from "express";
import {CustomValidator, validationResult} from "express-validator";
import {ErrorsType} from "../utils/types";
import {bloggers, bloggersInMemoryRepository} from "../repositories/bloggers-in-memory-repository";


export const checkedValidation = (req: Request, res: Response, next: NextFunction) => {
    const error = validationResult(req).mapped();
    let errors: ErrorsType = {errorsMessages: []}
    Object.keys(error).forEach(a => errors.errorsMessages.push({message: `не валидное поле ${error[a].param}`, field: error[a].param}))

    if(errors.errorsMessages.length > 0) {
        res.status(400).send(errors)
    } else {
        next()
    }
}

export const isValidId: CustomValidator = blogId => {
    const foundBloggers = bloggers.find(b => b.id === blogId)
    if(!foundBloggers) {
        return Promise.reject('blogId не валидный')
    } else {
        return true
    }
}
