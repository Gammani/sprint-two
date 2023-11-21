import {LikeStatus} from "../utils/types";

export type LikesInfoViewModel = {
    likesCount: number,
    dislikesCount: number,
    myStatus: typeof LikeStatus
}