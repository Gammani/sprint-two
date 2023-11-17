import {Response, Router} from "express";
import {RequestWithParams, RequestWithParamsAndBody} from "./inputModels/inputModels";
import {URIParamsCommentComIdModel, URIParamsCommentIdModel} from "./inputModels/URIParamsCommentIdModel";
import {HTTP_STATUSES} from "../utils/utils";
import {authBearerMiddleware} from "../middlewares/auth-middleware";
import {RequestCommentWithContent} from "../models/CreateCommentModel";
import {checkedValidation, commentValidation} from "../middlewares/requestValidatorWithExpressValidator";
import {CommentViewModel} from "./viewModels/CommentViewModel";
import {CommentsService} from "../application/comments-service";

export const commentsRouter = Router({})

class CommentsController {
    private commentsService: CommentsService

    constructor() {
        this.commentsService = new CommentsService()
    }

    async getCommentById(req: RequestWithParams<URIParamsCommentIdModel>, res: Response) {
        const foundComment = await this.commentsService.findCommentById(req.params.id)
        if (foundComment) {
            res.send(foundComment)
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }
    }

    async updateCommentById(req: RequestWithParamsAndBody<URIParamsCommentComIdModel, RequestCommentWithContent>, res: Response) {
        // console.log("req.user = ", +req.user!.userId)
        // console.log("idUserByComment?.commentatorInfo.userId = ", +idUserByComment!.commentatorInfo.userId)
        // console.log(+req.user!.userId === +idUserByComment!.commentatorInfo.userId)
        const foundComment: CommentViewModel | null = await this.commentsService.findCommentById(req.params.commentId)
        if (foundComment) {
            const idUserByComment = await this.commentsService.findCommentById(req.params.commentId)
            debugger
            if (req.user!.userId === idUserByComment!.commentatorInfo.userId) {
                debugger
                const isUpdate: boolean = await this.commentsService.updateComment(req.params.commentId, req.body.content)
                res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
            } else {
                debugger
                res.sendStatus(HTTP_STATUSES.FORBIDDEN_403)
            }
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }
    }

    async removeCommentById(req: RequestWithParams<URIParamsCommentComIdModel>, res: Response) {
        const foundComment: CommentViewModel | null = await this.commentsService.findCommentById(req.params.commentId)
        if (foundComment) {
            const idUserByComment = await this.commentsService.findCommentById(req.params.commentId)
            if (req.user!.userId === idUserByComment!.commentatorInfo.userId) {
                const isDeleteComment: boolean = await this.commentsService.deleteComment(req.params.commentId)
                res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
            } else {
                res.sendStatus(HTTP_STATUSES.FORBIDDEN_403)
            }
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }
    }
}

const commentsController = new CommentsController()

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


// commentsRouter.get('/:id', async (req: RequestWithParams<URIParamsCommentIdModel>, res: Response) => {
//     const foundComment = await commentsService.findCommentById(req.params.id)
//     if (foundComment) {
//         res.send(foundComment)
//     } else {
//         res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
//     }
// })
// commentsRouter.put('/:commentId', authBearerMiddleware,
//     commentValidation,
//     checkedValidation,
//
//     async (req: RequestWithParamsAndBody<URIParamsCommentComIdModel, RequestCommentWithContent>, res: Response) => {
//         // console.log("req.user = ", +req.user!.userId)
//         // console.log("idUserByComment?.commentatorInfo.userId = ", +idUserByComment!.commentatorInfo.userId)
//         // console.log(+req.user!.userId === +idUserByComment!.commentatorInfo.userId)
//         const foundComment: CommentViewModel | null = await commentsService.findCommentById(req.params.commentId)
//         if (foundComment) {
//             const idUserByComment = await commentsService.findCommentById(req.params.commentId)
//             debugger
//             if (req.user!.userId === idUserByComment!.commentatorInfo.userId) {
//                 debugger
//                 const isUpdate: boolean = await commentsService.updateComment(req.params.commentId, req.body.content)
//                 res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
//             } else {
//                 debugger
//                 res.sendStatus(HTTP_STATUSES.FORBIDDEN_403)
//             }
//         } else {
//             res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
//         }
//
//
//     })
// commentsRouter.delete('/:commentId', authBearerMiddleware,
//
//     async (req: RequestWithParams<URIParamsCommentComIdModel>, res) => {
//         const foundComment: CommentViewModel | null = await commentsService.findCommentById(req.params.commentId)
//         if (foundComment) {
//             const idUserByComment = await commentsService.findCommentById(req.params.commentId)
//             if (req.user!.userId === idUserByComment!.commentatorInfo.userId) {
//                 const isDeleteComment: boolean = await commentsService.deleteComment(req.params.commentId)
//                 res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
//             } else {
//                 res.sendStatus(HTTP_STATUSES.FORBIDDEN_403)
//             }
//         } else {
//             res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
//         }
//     })