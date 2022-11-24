export type QueryPostsModel= {
    /**
     *  This title should be included in searching for found Posts
     */
    pageNumber: string
    pageSize: string
    sortBy: string
    sortDirection: string
    blogId?: string
}