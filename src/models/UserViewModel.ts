export type UserViewModel = {
    id: string
    login: string
    email: string
    createdAt: string
}

export type UserWithPaginationViewModel = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: UserViewModel[]
}