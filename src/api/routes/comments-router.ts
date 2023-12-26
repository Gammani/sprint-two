import {Router} from "express";
import {authBearerMiddleware, isTokenInsideHeader} from "../../middlewares/auth-middleware";
import {
    checkedValidation,
    commentValidation,
    commentLikeStatusValidation
} from "../../middlewares/requestValidatorWithExpressValidator";
import {container} from "../../composition-root";
import {CommentsController} from "../controllers/commentController";


const commentsController = container.resolve(CommentsController)


export const commentsRouter = Router({})


commentsRouter.get('/:id',
    isTokenInsideHeader,
    commentsController.getCommentById.bind(commentsController)
)
commentsRouter.put('/:commentId',
    authBearerMiddleware,
    commentValidation,
    checkedValidation,
    commentsController.updateCommentById.bind(commentsController)
)
commentsRouter.put('/:commentId/like-status',
    authBearerMiddleware,
    commentLikeStatusValidation,
    commentsController.updateLikeStatus.bind(commentsController)
    )
commentsRouter.delete('/:commentId',
    authBearerMiddleware,
    commentsController.removeCommentById.bind(commentsController)
)
