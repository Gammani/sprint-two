import {UserViewModel, UserWithPaginationViewModel} from "../models/UserViewModel";
import {usersCollection} from "./db";
import {UserType} from "../utils/types";
import {getUsersViewModel} from "../utils/utils";

export const usersRepository = {
    async findUsers(
        pageNumberQuery: string,
        pageSizeQuery: string,
        sortByQuery: string,
        sortDirectionQuery: string
    ): Promise<UserWithPaginationViewModel>{

        const pageNumber = isNaN(Number(pageNumberQuery)) ? 1 : Number(pageNumberQuery)
        const pageSize = isNaN(Number(pageSizeQuery)) ? 10 : Number(pageSizeQuery)
        const sortBy = sortByQuery ? sortByQuery : 'createdAt'
        const sortDirection = sortDirectionQuery === 'asc' ? 1 : -1

        const skipPages: number = (pageNumber - 1) * pageSize

        const items = await usersCollection
            .find({}, {projection: {_id: 0}})
            .sort({[sortBy]: sortDirection})
            .skip(skipPages)
            .limit(pageSize)
            .toArray()
        const totalCount = await usersCollection.find({}).count({})
        const pageCount = Math.ceil(totalCount/pageSize)

        return {
            pagesCount: pageCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: items.map(getUsersViewModel)
        }
    },
    async findUserByLoginOrEmail(loginOrEmail: string): Promise<UserType | null> {
        const foundUser = await usersCollection.findOne({$or: [{email: loginOrEmail}, {login: loginOrEmail}]})
        return foundUser
    },
    async createUser(newUser: UserType): Promise<UserViewModel> {
        const result = await usersCollection.insertOne({...newUser})
        return {
            id: newUser.id,
            login: newUser.login,
            email: newUser.email,
            createdAt: newUser.createdAt
        }
    },
    async deleteUser(id: string): Promise<boolean> {
        const result = await usersCollection.deleteOne({id: id})
        return result.deletedCount === 1
    },
    async deleteAll() {
        const result = await usersCollection.deleteMany({})
        return
    }
}