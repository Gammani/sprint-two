import {UserViewModel, UserWithPaginationViewModel} from "../models/UserViewModel";
import {usersCollection} from "./db";
import {UserType} from "../utils/types";
import {getUsersViewModel} from "../utils/utils";
import {ObjectId} from "mongodb";

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
        // const totalCount = await usersCollection.find({}).count({})
        const totalCount = await usersCollection.countDocuments({})
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
        const foundUser = await usersCollection.findOne({$or: [{'accountData.email': loginOrEmail}, {'accountData.login': loginOrEmail}]})
        return foundUser
    },
    async createUser(newUser: UserType): Promise<UserViewModel> {
         await usersCollection.insertOne({...newUser})
        return {
            id: newUser.accountData.id,
            login: newUser.accountData.login,
            email: newUser.accountData.email,
            createdAt: newUser.accountData.createdAt
        }
    },
    async deleteUser(id: string): Promise<boolean> {
        const result = await usersCollection.deleteOne({id: id})
        return result.deletedCount === 1
    },



    async findUserByConfirmationCode(confirmationCode: string) {
        const user = await usersCollection.findOne({"emailConfirmation.confirmationCode": confirmationCode})
        // const user = await usersCollection.findOne({$or: [{"emailConfirmation.email": email}, {"emailConfirmation.email": email}]})
        return user
    },
    async updateConfirmation(_id: ObjectId) {
        let result = await usersCollection
            .updateOne({_id}, {$set: {'emailConfirmation.isConfirmed': true}})
        return result.modifiedCount === 1
    },
    async updateCode(email: string, code: string) {
        debugger
        let result = await usersCollection
            .updateOne({'accountData.email': email}, {$set: {'emailConfirmation.confirmationCode': code}})
        return result.modifiedCount === 1
    },

    async deleteAll() {
        const result = await usersCollection.deleteMany({})
        return
    }
}