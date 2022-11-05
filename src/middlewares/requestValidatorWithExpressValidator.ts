import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";
import {ErrorsType} from "../utils/types";


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
