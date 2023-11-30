import {Router} from "express";
import {authBasicMiddleware, authBearerMiddleware, isTokenInsideHeader} from "../../middlewares/auth-middleware";
import {
    checkedValidation,
    commentValidation,
    postValidation
} from "../../middlewares/requestValidatorWithExpressValidator";
import {postsController} from "../../composition-root";


export const postsRouter = Router({})


postsRouter.get('/',
    postsController.getPosts.bind(postsController)
)
postsRouter.get('/:id',
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