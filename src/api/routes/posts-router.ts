import {Router} from "express";
import {authBasicMiddleware, authBearerMiddleware, isTokenInsideHeader} from "../../middlewares/auth-middleware";
import {
    checkedValidation,
    commentValidation,
    postLikeStatusValidation,
    postValidation
} from "../../middlewares/requestValidatorWithExpressValidator";
import {container} from "../../composition-root";
import {PostsController} from "../controllers/postController";


const postsController = container.resolve(PostsController)


export const postsRouter = Router({})


postsRouter.get('/',
    isTokenInsideHeader,
    postsController.getPosts.bind(postsController)
)
postsRouter.get('/:id',
    isTokenInsideHeader,
    postsController.getPostById.bind(postsController)
)
postsRouter.post('/',
    authBasicMiddleware,
    postValidation,
    checkedValidation,
    postsController.createPostByAdmin.bind(postsController)
)
postsRouter.put('/:id',
    authBasicMiddleware,
    postValidation,
    checkedValidation,
    postsController.updatePostByIdByAdmin.bind(postsController)
)
postsRouter.put('/:postId/like-status',
    authBearerMiddleware,
    postLikeStatusValidation,
    postsController.updatePostLikeStatus.bind(postsController)
)
postsRouter.delete('/:id',
    authBasicMiddleware,
    postsController.removePostByIdByAdmin.bind(postsController)
)
// Comments from post    !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
postsRouter.get('/:postId/comments',
    isTokenInsideHeader,
    postsController.getCommentsByPostId.bind(postsController)
)
postsRouter.post('/:postId/comments',
    authBearerMiddleware,
    commentValidation,
    checkedValidation,
    postsController.createCommentByPostId.bind(postsController)
)