import {UserViewModel, UserWithPaginationViewModel} from "../api/viewModels/UserViewModel";
import {User, UserTypeDbModel} from "../utils/types";
import {UserModel} from "../mongo/user/user.model";


export class UsersRepository {
    async findUsers(
        pageNumberQuery: string,
        pageSizeQuery: string,
        sortByQuery: string,
        sortDirectionQuery: string
    ): Promise<UserWithPaginationViewModel> {

        const pageNumber = isNaN(Number(pageNumberQuery)) ? 1 : Number(pageNumberQuery)
        const pageSize = isNaN(Number(pageSizeQuery)) ? 10 : Number(pageSizeQuery)
        const sortBy = sortByQuery ? sortByQuery : 'createdAt'
        const sortDirection = sortDirectionQuery === 'asc' ? 1 : -1

        const skipPages: number = (pageNumber - 1) * pageSize

        const items: UserTypeDbModel[] = await UserModel
            .find({}, { blackListRefreshTokens: 0})
            .sort({[sortBy]: sortDirection})
            .skip(skipPages)
            .limit(pageSize)
            .lean()
        // const items = await UserModel.find().lean()
        // const totalCount = await usersCollection.find({}).count({})

        const totalCount = await UserModel.countDocuments({})
        const pageCount = Math.ceil(totalCount / pageSize)

        debugger

        return {
            pagesCount: pageCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            // items: items.map(getUsersViewModel)
            items: items.map(item => {
                return {
                    id: item._id.toString(),
                    login: item.accountData.login,
                    email: item.accountData.email,
                    createdAt: item.accountData.createdAt
                }
            })
        }
    }
    async findUserByLogin(login: string): Promise<UserTypeDbModel | null> {
        const foundUser = await UserModel.findOne({'accountData.login': login})
        if(foundUser) {
            return foundUser
        } else {
            return null
        }
    }
    async findUserByEmail(email: string): Promise<UserTypeDbModel | null> {
        const foundUser = await UserModel.findOne({'accountData.email': email})
        if(foundUser) {
            return foundUser
        } else {
            return null
        }
    }
    async findUserByLoginOrEmail(loginOrEmail: string): Promise<UserTypeDbModel | null> {
        const foundUser = await UserModel.findOne({$or: [{'accountData.email': loginOrEmail}, {'accountData.login': loginOrEmail}]})
        return foundUser
    }
    async findUserByLoginAndEmail(email: string, login: string) {
        const foundUser = await UserModel.findOne({$or: [{'accountData.email': email}, {'accountData.login': login}]})
        return foundUser
    }
    async createUser(newUser: User): Promise<UserViewModel> {
        const userInstance = new UserModel

        userInstance.accountData = newUser.accountData
        userInstance.emailConfirmation = newUser.emailConfirmation

        const res = await userInstance.save()

        return {
            id: res._id.toString(),
            login: newUser.accountData.login,
            email: newUser.accountData.email,
            createdAt: newUser.accountData.createdAt
        }
    }
    async findUserByRecoveryCode(recoveryCode: string): Promise<UserTypeDbModel | null> {
        const foundUser = UserModel.findOne({"accountData.recoveryCode": recoveryCode})
        return foundUser
    }
    async deleteUser(id: string): Promise<boolean> {
        const result = await UserModel.deleteOne({id: id})
        return result.deletedCount === 1
    }


    async findUserByConfirmationCode(confirmationCode: string) {
        debugger
        console.log("confirmationCode = ", confirmationCode)
        const user = await UserModel.findOne({"emailConfirmation.confirmationCode": confirmationCode})
        // const user = await usersCollection.findOne({$or: [{"emailConfirmation.email": email}, {"emailConfirmation.email": email}]})
        console.log('user = ', user)
        return user
    }
    async updateConfirmation(_id: string) {
        let result = await UserModel
            .updateOne({_id}, {$set: {'emailConfirmation.isConfirmed': true}})
        return result.modifiedCount === 1
    }
    async updatePassword(passwordHash: string, recoveryCode: string) {
        let result = await UserModel
            .updateOne({'accountData.recoveryCode': recoveryCode}, {$set: {'accountData.passwordHash': passwordHash}})
    }
    async updateCode(email: string, code: string) {
        debugger
        let result = await UserModel
            .updateOne({'accountData.email': email}, {$set: {'emailConfirmation.confirmationCode': code}})
        debugger
        return result.modifiedCount === 1
    }
    async updateRecoveryCode(email: string, recoveryCode: string) {
        let result = await UserModel
            .updateOne({'accountData.email': email}, {$set: {'accountData.recoveryCode': recoveryCode}})
        debugger
        return result.modifiedCount === 1
    }
    async deleteAll() {
        const result = await UserModel.deleteMany({})
        return
    }
}