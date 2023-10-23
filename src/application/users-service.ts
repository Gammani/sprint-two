import {UserViewModel, UserWithPaginationViewModel} from "../models/UserViewModel";
import bcrypt from 'bcrypt'
import {v4 as uuidv4} from "uuid";
import add from "date-fns/add";
import {emailAdapter} from "../adapter/email-adapter";
import {securityDevicesService} from "./sequrity-devices-service";
import {usersRepository} from "../repositories/users-mongoose-repository";
import {User, UserTypeDbModel} from "../utils/types";
import {UserModel} from "../mongo/user/user.model";


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
    async findUserById(userId: string): Promise<UserTypeDbModel | null> {
        debugger
        const user: UserTypeDbModel | null = await UserModel.findOne({'_id': userId}, {projection: {_id: 0, blackListRefreshTokens: 0}})
        if (user) {
            return user
        } else {
            return null
        }
    },
    async findUserByDeviceId(deviceId: string): Promise<UserTypeDbModel | null> {
        debugger
        const foundUserId = await securityDevicesService.findUserIdByDeviceId(deviceId)
        if(foundUserId) {
            return this.findUserById(foundUserId)
        } else {
            return null
        }
    },
    async findUserByRecoveryCode(recoveryCode: string): Promise<User | null> {
        const foundUser = usersRepository.findUserByRecoveryCode(recoveryCode)
        return foundUser
    },
    async createUser(login: string, email: string, password: string): Promise<UserViewModel | null> {

        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(password, passwordSalt)

        const newUser: User = {
            accountData: {
                login,
                email,
                createdAt: new Date().toISOString(),
                passwordHash,
                recoveryCode: uuidv4()
            },
            emailConfirmation: {
                confirmationCode: uuidv4(),
                expirationDate: add(new Date(), {
                    hours: 1,
                    minutes: 3
                }).toString(),
                isConfirmed: false
            }
        }
        const createResult = await usersRepository.createUser(newUser)

        try {
            await emailAdapter.sendEmail(email, login, `\` <h1>Thank for your registration</h1>
 <p>To finish registration please follow the link below:
     <a href='https://somesite.com/confirm-email?code=${newUser.emailConfirmation.confirmationCode}'>complete registration</a>
 </p>\``)
        } catch (e) {
            console.log(e)
            return null
        }
        return createResult
    },
    async createUserByAdmin(login: string, email: string, password: string): Promise<UserViewModel> {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(password, passwordSalt)

        const newUser: User = {
            accountData: {
                login,
                email,
                createdAt: new Date().toISOString(),
                passwordHash,
                recoveryCode: uuidv4()
            },
            emailConfirmation: {
                confirmationCode: uuidv4(),
                expirationDate: add(new Date(), {
                    hours: 1,
                    minutes: 3
                }).toString(),
                isConfirmed: true
            }
        }
        return await usersRepository.createUser(newUser)
    },
    async deleteUser(id: string): Promise<boolean> {
        return await usersRepository.deleteUser(id)
    },
    async deleteAll() {
        return await usersRepository.deleteAll()
    },
    async checkCredentials(loginOrEmail: string, password: string): Promise<UserTypeDbModel | null> {
        const user: UserTypeDbModel | null = await usersRepository.findUserByLoginOrEmail(loginOrEmail)

        if (!user) return null
        if (!user.emailConfirmation.isConfirmed) return null

        const isHashesEquals: any = await this._isPasswordCorrect(password, user.accountData.passwordHash)
        if (isHashesEquals) {
            return user
        } else {
            return null
        }
    },
    async _generateHash(password: string, salt: string) {
        const hash = await bcrypt.hash(password, salt)
        // console.log('hash: ' + hash)
        return hash
    },
    async _isPasswordCorrect(password: string, hash: string) {
        const isEqual = await bcrypt.compare(password, hash)
        return isEqual
    },
    async updatePassword(newPassword: string, recoveryCode: string) {
        debugger
        const foundUser = await usersService.findUserByRecoveryCode(recoveryCode)
        if(foundUser) {
            const passwordSalt = await bcrypt.genSalt(10)
            const passwordHash = await this._generateHash(newPassword, passwordSalt)


            return usersRepository.updatePassword(passwordHash, recoveryCode)
        }
        return
    }
}