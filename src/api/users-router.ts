import {Response, Router} from "express";
import {authBasicMiddleware} from "../middlewares/auth-middleware";
import {QueryUsersModel} from "../models/QueryUsersModel";
import {UserViewModel, UserWithPaginationViewModel} from "./viewModels/UserViewModel";
import {HTTP_STATUSES} from "../utils/utils";
import {UsersQueryRepository} from "../repositories/users-query-mongoose-repository";
import {UsersService} from "../application/users-service";
import {CreateUserModel} from "../models/CreateUserModel";
import {authRegistrationValidation, checkedValidation} from "../middlewares/requestValidatorWithExpressValidator";
import {URIParamsUserIdModel} from "./inputModels/URIParamsUserIdModel";
import {RequestWithBody, RequestWithParams, RequestWithQuery} from "./inputModels/inputModels";

export const usersRouter = Router({})

class UsersController {
    private usersService: UsersService
    private usersQueryMongooseRepository: UsersQueryRepository

    constructor() {
        this.usersQueryMongooseRepository = new UsersQueryRepository()
        this.usersService = new UsersService()
    }

    async getAllUsers(req: RequestWithQuery<QueryUsersModel>, res: Response<UserWithPaginationViewModel>) {
        if (req.query.searchEmailTerm || req.query.searchLoginTerm) {
            const foundUsers: UserWithPaginationViewModel = await this.usersQueryMongooseRepository.findUsers(
                req.query.searchLoginTerm,
                req.query.searchEmailTerm,
                req.query.pageNumber,
                req.query.pageSize,
                req.query.sortBy,
                req.query.sortDirection
            )
            res.status(HTTP_STATUSES.OK_200).send(foundUsers)
        } else {
            const foundUsers: UserWithPaginationViewModel = await this.usersService.findUsers(
                req.query.pageNumber,
                req.query.pageSize,
                req.query.sortBy,
                req.query.sortDirection
            )
            res.status(HTTP_STATUSES.OK_200).send(foundUsers)
        }
    }

    async addNewUserByAdmin(req: RequestWithBody<CreateUserModel>, res: Response<UserViewModel>) {
        const newUser: UserViewModel = await this.usersService.createUserByAdmin(req.body.login, req.body.email, req.body.password)
        res.status(HTTP_STATUSES.CREATED_201).send(newUser)
    }

    async removeUserByAdmin(req: RequestWithParams<URIParamsUserIdModel>, res: Response) {
        const isDeleteUser: boolean = await this.usersService.deleteUser(req.params.id)
        if (isDeleteUser) {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }
    }
}

const usersController = new UsersController()


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


// usersRouter.get('/', authBasicMiddleware,
//     async (req: RequestWithQuery<QueryUsersModel>, res: Response<UserWithPaginationViewModel>) => {
//         if (req.query.searchEmailTerm || req.query.searchLoginTerm) {
//             const foundUsers: UserWithPaginationViewModel = await usersQueryMongooseRepository.findUsers(
//                 req.query.searchLoginTerm,
//                 req.query.searchEmailTerm,
//                 req.query.pageNumber,
//                 req.query.pageSize,
//                 req.query.sortBy,
//                 req.query.sortDirection
//             )
//             res.status(HTTP_STATUSES.OK_200).send(foundUsers)
//         } else {
//             const foundUsers: UserWithPaginationViewModel = await usersService.findUsers(
//                 req.query.pageNumber,
//                 req.query.pageSize,
//                 req.query.sortBy,
//                 req.query.sortDirection
//             )
//             res.status(HTTP_STATUSES.OK_200).send(foundUsers)
//         }
//     })
// usersRouter.post('/', authBasicMiddleware,
//     body('login').isString().trim().isLength({min: 3, max: 10}).notEmpty().matches(/^[a-zA-Z0-9_-]*$/),
//     body('password').isString().trim().isLength({min: 6, max: 20}).notEmpty(),
//     body('email').isString().trim().notEmpty().matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/),
//     checkedValidation,
//     async (req: RequestWithBody<CreateUserModel>, res: Response<UserViewModel>) => {
//         const newUser: UserViewModel = await usersService.createUserByAdmin(req.body.login, req.body.email, req.body.password)
//         res.status(HTTP_STATUSES.CREATED_201).send(newUser)
//     })
// usersRouter.delete('/:id', authBasicMiddleware,
//     async (req: RequestWithParams<URIParamsUserIdModel>, res) => {
//         const isDeleteUser: boolean = await usersService.deleteUser(req.params.id)
//         if (isDeleteUser) {
//             res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
//         } else {
//             res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
//         }
//     })