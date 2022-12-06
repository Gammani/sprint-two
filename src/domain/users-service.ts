import {UserViewModel, UserWithPaginationViewModel} from "../models/UserViewModel";
import {usersRepository} from "../repositories/users-db-repository";
import bcrypt from 'bcrypt'
import {UserType} from "../utils/types";


export const usersService = {
    async findUsers(
        pageNumberQuery: string,
        pageSizeQuery: string,
        sortByQuery: string,
        sortDirectionQuery: string
    ): Promise<UserWithPaginationViewModel> {
        return await usersRepository.findUsers(
            pageNumberQuery,
            pageSizeQuery,
            sortByQuery,
            sortDirectionQuery
        )
    },
    async createUser(login: string, email: string, password: string): Promise<UserViewModel> {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(password, passwordSalt)

        const newUser: UserType = {
            id: (+new Date()).toString(),
            login,
            email,
            createdAt: new Date().toISOString(),
            passwordHash,
            passwordSalt
        }
        return await usersRepository.createUser(newUser)
    },
    async deleteUser(id: string): Promise<boolean> {
        return await usersRepository.deleteUser(id)
    },
    async deleteAll() {
        return await usersRepository.deleteAll()
    },
    async _generateHash(password: string, salt: string) {
        const hash = await bcrypt.hash(password, salt)
        console.log('hash: ' + hash)
        return hash
    }
}