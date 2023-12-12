import {Router} from "express";
import {authBasicMiddleware} from "../../middlewares/auth-middleware";
import {
    blogValidation,
    checkedValidation,
    createPostWithoutBlogIdValidation
} from "../../middlewares/requestValidatorWithExpressValidator";
import {container} from "../../composition-root";
import {BlogController} from "../controllers/blogController";


const blogController = container.resolve(BlogController)


export const blogsRouter = Router({})


blogsRouter.get('/', blogController.getBlogs.bind(blogController))
blogsRouter.get('/:id', blogController.getBlogById.bind(blogController))
blogsRouter.get('/:blogId/posts', blogController.getPostsByBlogId.bind(blogController))
blogsRouter.post('/',
    authBasicMiddleware,
    blogValidation,
    checkedValidation,
    blogController.createBlogByAdmin.bind(blogController)
)
blogsRouter.post('/:blogId/posts',
    authBasicMiddleware,
    createPostWithoutBlogIdValidation,
    checkedValidation,
    blogController.createPostByAdmin.bind(blogController)
)
blogsRouter.put('/:id',
    authBasicMiddleware,
    blogValidation,
    checkedValidation,
    blogController.updateBlogByAdmin.bind(blogController)
)
blogsRouter.delete('/:id',
    authBasicMiddleware,
    blogController.removeBlogByAdmin.bind(blogController)
)
