import {CommentsService} from "../../application/comments-service";
import {RequestWithParams, RequestWithParamsAndBody} from "../inputModels/inputModels";
import {URIParamsCommentComIdModel, URIParamsCommentIdModel} from "../inputModels/URIParamsCommentIdModel";
import {Response} from "express";
import {HTTP_STATUSES} from "../../utils/utils";
import {RequestCommentWithContent} from "../../models/CreateCommentModel";
import {CommentsQueryRepository} from "../../repositories/comments-query-repository";
import {CommentDBType, LikeDbType} from "../../utils/types";
import {LikeStatusService} from "../../application/like-status-service";
import {RequestCommentWithLikeStatus} from "../../models/CreateLikeStatusModel";
import {ObjectId} from "mongodb";
import {inject, injectable} from "inversify";


@injectable()
export class CommentsController {
    constructor(
        @inject(CommentsService) protected commentsService: CommentsService,
        @inject(CommentsQueryRepository) protected commentsQueryRepository: CommentsQueryRepository,
        @inject(LikeStatusService) protected likeStatusService: LikeStatusService
    ) {
    }

    async getCommentById(req: RequestWithParams<URIParamsCommentIdModel>, res: Response) {
        const foundComment: CommentDBType | null = await this.commentsService.findCommentById(req.params.id)
        if (foundComment) {
            if (req.user) {
                const foundCommentWithUser = await this.commentsQueryRepository.findCommentById(req.params.id, new ObjectId(req.user.userId))
                res.send(foundCommentWithUser)
            } else {
                const foundCommentWithUserNoName = await this.commentsQueryRepository.findCommentById(req.params.id)
                res.send(foundCommentWithUserNoName)
            }
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }
    }

    async updateCommentById(req: RequestWithParamsAndBody<URIParamsCommentComIdModel, RequestCommentWithContent>, res: Response) {
        // console.log("req.user = ", +req.user!.userId)
        // console.log("idUserByComment?.commentatorInfo.userId = ", +idUserByComment!.commentatorInfo.userId)
        // console.log(+req.user!.userId === +idUserByComment!.commentatorInfo.userId)
        const foundComment: CommentDBType | null = await this.commentsService.findCommentById(req.params.commentId)
        if (foundComment) {
            // const idUserByComment = await this.commentsService.findCommentById(req.params.commentId)
            if (req.user!.userId === foundComment.commentatorInfo.userId) {
                const isUpdate: boolean = await this.commentsService.updateComment(req.params.commentId, req.body.content)
                res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
            } else {
                res.sendStatus(HTTP_STATUSES.FORBIDDEN_403)
            }
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }
    }

    async updateLikeStatus(req: RequestWithParamsAndBody<URIParamsCommentComIdModel, RequestCommentWithLikeStatus>, res: Response) {
        debugger
        const foundComment: CommentDBType | null = await this.commentsService.findCommentById(req.params.commentId)
        if (foundComment) {
            debugger
            const foundLikeFromUser: LikeDbType | null = await this.likeStatusService.findLike(foundComment._id, new ObjectId(req.user!.userId))
            console.log("foundLikeFromUser = ", foundLikeFromUser)
            if (foundLikeFromUser) {
                console.log("нашел")
                const isUpdated = await this.likeStatusService.updateLikeStatus(req.body.likeStatus, foundLikeFromUser)
                res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
            } else {
                debugger
                console.log("ненашел")
                const isCreated = await this.likeStatusService.createLike(foundComment, req.body.likeStatus, new ObjectId(req.user!.userId))

                res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
            }

        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }
    }

    async removeCommentById(req: RequestWithParams<URIParamsCommentComIdModel>, res: Response) {
        const foundComment: CommentDBType | null = await this.commentsService.findCommentById(req.params.commentId)
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