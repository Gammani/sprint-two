export type QueryUsersModel = {
    /**
     * This login or email should be included in searching for found Users
     */
    searchLoginTerm?: string
    searchEmailTerm?: string
    pageNumber: string
    pageSize: string
    sortBy: string
    sortDirection: string
}