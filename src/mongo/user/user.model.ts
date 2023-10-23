import mongoose from 'mongoose'
import {AccountDataType, EmailConfirmationType, UserTypeDbModel} from "../../utils/types";


const AccountDataSchema = new mongoose.Schema<AccountDataType>({
    login: {type: String, required: true},
    email: {type: String, required: true},
    createdAt: {type: String, required: true},
    passwordHash: {type: String, required: true},
    recoveryCode: {type: String, required: true}
})
const EmailConfirmationSchema = new mongoose.Schema<EmailConfirmationType>({
    confirmationCode: {type: String, required: true},
    expirationDate: {type: String, required: true},
    isConfirmed: {type: Boolean, required: true}
})

export const UserSchema = new mongoose.Schema<UserTypeDbModel>({
    // accountData: {type: {id: String, login: String, email: String, createdAt: String, passwordHash: String}, required: true},
    // emailConfirmation: {type: {confirmationCode: String, expirationDate: String, isConfirmed: Boolean}, required: true}
    accountData: {type: AccountDataSchema, required: true},
    emailConfirmation: {type: EmailConfirmationSchema, required: true}
})

export const UserModel = mongoose.model<UserTypeDbModel>('users', UserSchema)