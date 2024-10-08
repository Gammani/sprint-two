import {RequestUserViewModel} from "../api/viewModels/UserViewModel";
import {CommentDBType, LikeStatus, PostDbType} from "../utils/types";
import {ObjectId} from "mongodb";
import {CommentsRepository} from "../repositories/comments-mongoose-repository";
import {PostsRepository} from "../repositories/posts-mongoose-repository";
import {CommentsQueryRepository} from "../repositories/comments-query-repository";
import {inject, injectable} from "inversify";


@injectable()
export class CommentsService {
    constructor(
        @inject(CommentsRepository) protected commentsRepository: CommentsRepository,
        @inject(PostsRepository) protected postsRepository: PostsRepository,
        @inject(CommentsQueryRepository) protected commentsQueryRepository: CommentsQueryRepository
    ) {
    }

    async findCommentById(id: string): Promise<CommentDBType | null> {
        return await this.commentsRepository.findCommentById(id)
    }

    async createComment(content: string, user: RequestUserViewModel | undefined | null, postId: string): Promise<CommentDBType | null> {
        const foundPost: PostDbType | null = await this.postsRepository.findPostById(postId)
        if (foundPost) {

            const createdComment: CommentDBType = {
                _id: new ObjectId,
                content: content,
                commentatorInfo: {
                    userId: user!.userId,
                    userLogin: user!.login
                },
                createdAt: new Date().toISOString(),
                _postId: new ObjectId(postId),
                _blogId: new ObjectId(foundPost.blogId),
                likesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: LikeStatus.None
                }
            }

            return await this.commentsRepository.createComment(createdComment)
        } else {
            return null
        }
    }

    async updateComment(commentId: string, content: string): Promise<boolean> {
        return await this.commentsRepository.updateComment(commentId, content)
    }

    async deleteComment(id: string): Promise<boolean> {
        return await this.commentsRepository.deleteComment(id)
    }

    async deleteAll() {
        return await this.commentsRepository.deleteAll()
    }
}