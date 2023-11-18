import {Router} from "express";
import {authBearerMiddleware} from "../../middlewares/auth-middleware";
import {checkedValidation, commentValidation} from "../../middlewares/requestValidatorWithExpressValidator";
import {commentsController} from "../../composition-root";

export const commentsRouter = Router({})


commentsRouter.get('/:id', commentsController.getCommentById.bind(commentsController))
commentsRouter.put('/:commentId',
    authBearerMiddleware,
    commentValidation,
    checkedValidation,
    commentsController.updateCommentById.bind(commentsController)
)
commentsRouter.delete('/:commentId',
    authBearerMiddleware,
    commentsController.removeCommentById.bind(commentsController)
)
