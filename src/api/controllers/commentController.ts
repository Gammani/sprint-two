import {CommentsService} from "../../application/comments-service";
import {RequestWithParams, RequestWithParamsAndBody} from "../inputModels/inputModels";
import {URIParamsCommentComIdModel, URIParamsCommentIdModel} from "../inputModels/URIParamsCommentIdModel";
import {Response} from "express";
import {HTTP_STATUSES} from "../../utils/utils";
import {RequestCommentWithContent} from "../../models/CreateCommentModel";
import {CommentViewModel} from "../viewModels/CommentViewModel";

export class CommentsController {
    constructor(protected commentsService: CommentsService) {
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
            if (req.user!.userId === idUserByComment!.commentatorInfo.userId) {
                const isUpdate: boolean = await this.commentsService.updateComment(req.params.commentId, req.body.content)
                res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
            } else {
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