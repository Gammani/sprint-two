import {LikeStatus} from "../utils/types";

export type CommentLikeViewModel = {
    likesCount: number,
    dislikesCount: number,
    myStatus: typeof LikeStatus
}