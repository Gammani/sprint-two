import {usersRepository} from "../repositories/users-db-repository";

export const authService = {
    async confirmEmail(code: string) {
        let user = await usersRepository.findUserByConfirmationCode(code)
        if (!user) return false
        if (user.emailConfirmation.isConfirmed) return false
        if (user.emailConfirmation.confirmationCode !== code) return false
        if (user.emailConfirmation.expirationDate < new Date().toString()) return false

        let result = await usersRepository.updateConfirmation(user._id)
        return result
    }
}