import {Response, Router} from "express";
import {RequestWithParams, RequestWithParamsAndBody} from "../utils/types";
import {URIParamsCommentComIdModel, URIParamsCommentIdModel} from "../models/URIParamsCommentIdModel";
import {commentsService} from "../domain/comments-service";
import {HTTP_STATUSES} from "../utils/utils";
import {authBearerMiddleware} from "../middlewares/auth-middleware";
import {RequestCommentWithContent} from "../models/CreateCommentModel";
import {body} from "express-validator";
import {checkedValidation} from "../middlewares/requestValidatorWithExpressValidator";

export const commentsRouter = Router({})

commentsRouter.get('/:id', async (req: RequestWithParams<URIParamsCommentIdModel>, res: Response) => {
    const foundComment = await commentsService.findCommentById(req.params.id)
    if (foundComment) {
        res.send(foundComment)
    } else {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }
})
commentsRouter.put('/:commentId', authBearerMiddleware,
    body('content').isString().trim().notEmpty().isLength({max: 300, min: 20}),
    checkedValidation,


    async (req: RequestWithParamsAndBody<URIParamsCommentComIdModel, RequestCommentWithContent>, res) => {

        const idUserByComment = await commentsService.findCommentById(req.params.commentId)
        // console.log("req.user = ", +req.user!.userId)
        // console.log("idUserByComment?.commentatorInfo.userId = ", +idUserByComment!.commentatorInfo.userId)
        // console.log(+req.user!.userId === +idUserByComment!.commentatorInfo.userId)
        if (+req.user!.userId === +idUserByComment!.commentatorInfo.userId) {
            const isUpdate: boolean = await commentsService.updateComment(req.params.commentId, req.body.content)
            if (isUpdate) {
                res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
            } else {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            }
        } else {
            res.sendStatus(HTTP_STATUSES.FORBIDDEN_403)
        }

    })
commentsRouter.delete('/:commentId', authBearerMiddleware,

    async (req: RequestWithParams<URIParamsCommentComIdModel>, res) => {
        const isDeleteComment: boolean = await commentsService.deleteComment(req.params.commentId)
        if (isDeleteComment) {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }
    })