import {UsersService} from "../../application/users-service";
import {UsersQueryRepository} from "../../repositories/users-query-mongoose-repository";
import {RequestWithBody, RequestWithParams, RequestWithQuery} from "../inputModels/inputModels";
import {QueryUsersModel} from "../../models/QueryUsersModel";
import {Response} from "express";
import {UserViewModel, UserWithPaginationViewModel} from "../viewModels/UserViewModel";
import {HTTP_STATUSES} from "../../utils/utils";
import {CreateUserModel} from "../../models/CreateUserModel";
import {URIParamsUserIdModel} from "../inputModels/URIParamsUserIdModel";
import {inject, injectable} from "inversify";


@injectable()
export class UsersController {
    constructor(@inject(UsersService) protected usersService: UsersService,
                @inject(UsersQueryRepository) protected usersQueryRepository: UsersQueryRepository) {
    }

    async getAllUsers(req: RequestWithQuery<QueryUsersModel>, res: Response<UserWithPaginationViewModel>) {
        if (req.query.searchEmailTerm || req.query.searchLoginTerm) {
            const foundUsers: UserWithPaginationViewModel = await this.usersQueryRepository.findUsers(
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
