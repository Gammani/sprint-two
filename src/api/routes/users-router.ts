import {Router} from "express";
import {authBasicMiddleware} from "../../middlewares/auth-middleware";
import {authRegistrationValidation, checkedValidation} from "../../middlewares/requestValidatorWithExpressValidator";
import {container} from "../../composition-root";
import {UsersController} from "../controllers/userController";


const usersController = container.resolve(UsersController)

export const usersRouter = Router({})


usersRouter.get('/',
    authBasicMiddleware,
    usersController.getAllUsers.bind(usersController)
)
usersRouter.post('/', authBasicMiddleware,
    authRegistrationValidation,
    checkedValidation,
    usersController.addNewUserByAdmin.bind(usersController))
usersRouter.delete('/:id',
    authBasicMiddleware,
    usersController.removeUserByAdmin.bind(usersController))
