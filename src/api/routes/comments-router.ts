import {Router} from "express";
import {authBearerMiddleware, isTokenInsideHeader} from "../../middlewares/auth-middleware";
import {
    checkedValidation,
    commentValidation,
    likeStatusValidation
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
    likeStatusValidation,
    commentsController.updateLikeStatus.bind(commentsController)
    )
commentsRouter.delete('/:commentId',
    authBearerMiddleware,
    commentsController.removeCommentById.bind(commentsController)
)
