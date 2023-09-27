
import {emailAdapter} from "../adapter/email-adapter";
import {v4 as uuidv4} from "uuid";
import {usersRepository} from "../repositories/users-mongoose-repository";

export const authService = {
    async confirmEmail(code: string) {
        let user = await usersRepository.findUserByConfirmationCode(code)
        if (!user) return false
        if (user.emailConfirmation.isConfirmed) return false
        if (user.emailConfirmation.confirmationCode !== code) return false
        if (user.emailConfirmation.expirationDate < new Date().toString()) return false

        let result = await usersRepository.updateConfirmation(user._id.toString())
        return result
    },
    async resendCode(email: string) {
        const foundUser = await usersRepository.findUserByLoginOrEmail(email)
        if (foundUser) {
            debugger
            const code = uuidv4()
            const createResult = await usersRepository.updateCode(email, code)
            try {
                debugger
                await emailAdapter.sendEmail(email, foundUser.accountData.login, `\` <h1>Thank for your registration</h1>
 <p>To finish registration please follow the link below:
     <a href='https://somesite.com/confirm-email?code=${code}'>complete registration</a>
 </p>\``)
                debugger
                return createResult
            } catch (e) {
                console.log(e)
                return null
            }
        } else {
            return null
        }
    },

    async passwordRecovery(email: string) {
        const foundUser = await usersRepository.findUserByLoginOrEmail(email)

        if (foundUser) {
            const code = uuidv4()
            const createResult = await usersRepository.updateCode(email, code)
            try {
                await emailAdapter.sendEmail(email, foundUser.accountData.login, `\` <h1>Password recovery</h1>
 <p>To finish password recovery please follow the link below:
     <a href='https://somesite.com/password-recovery?recoveryCode=${code}'>recovery password</a>
 </p>\``)
                debugger
                return createResult
            } catch (e) {
                console.log(e)
                return null
            }
        } else {
            return null
        }
    }
}