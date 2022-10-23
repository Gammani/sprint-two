export type BloggersType = {
    id: string,
    name: string,
    youtubeUrl: string
}
export type PostsType = {
    id: string,
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
}