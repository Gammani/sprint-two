import {CommentViewModel} from "../models/CommentViewModel";
import {commentsCollection} from "./db";

export const commentsRepository = {
    async createComment(createdComment: CommentViewModel): Promise<CommentViewModel> {
        const result = await commentsCollection.insertOne({...createdComment})
        return createdComment
    }
}