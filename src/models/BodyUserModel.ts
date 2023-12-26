type UserType = {
    email: string,
    login: string,
    userId: string,
}

export type BodyUserModel = {
    /**
     *  This user maybe should be included in searching for found Posts
     */
    user?: UserType
}