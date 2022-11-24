export type QueryBloggersModel = {
    /**
     * This name should be included in searching for found Bloggers
     */
    searchNameTerm?: string
    pageNumber: string
    pageSize: string
    sortBy: string
    sortDirection: string
}
export type QueryBloggersModelWithId = {
    pageNumber: string
    pageSize: string
    sortBy: string
    sortDirection: string
    blogId?: string
}