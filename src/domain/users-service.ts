import {UserViewModel, UserWithPaginationViewModel} from "../models/UserViewModel";
import {usersRepository} from "../repositories/users-db-repository";
import bcrypt from 'bcrypt'
import {UserDBType, UserType} from "../utils/types";
import {usersCollection} from "../repositories/db";


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
    async findUserById(userId: string): Promise<UserViewModel | null> {
        const user: UserViewModel | null = await usersCollection.findOne({id: userId}, {projection: {_id: 0}})
        if(user) {
            return user
        } else {
            return null
        }
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
    async checkCredentials(loginOrEmail: string, password: string): Promise<UserType | null> {
        const user: UserType | null = await usersRepository.findUserByLoginOrEmail(loginOrEmail)
        if(!user) {
            return null
        } else {
            const passwordHash = await this._generateHash(password, user.passwordSalt)
            if(user.passwordHash !== passwordHash) return null
        }
        return user
    },
    async _generateHash(password: string, salt: string) {
        const hash = await bcrypt.hash(password, salt)
        // console.log('hash: ' + hash)
        return hash
    }
}