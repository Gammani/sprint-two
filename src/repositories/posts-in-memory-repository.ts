import {PostsType} from "../utils/types";
import {PostViewModel} from "../models/PostViewModel";
import {getPostsViewModel} from "../utils/utils";
import {bloggers, OldBloggerViewModel} from "./bloggers-in-memory-repository";

export type OldPostsType = {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
}
export type OldPostsViewType = {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
}
const getOldPostsViewModel = (post: OldPostsType): OldPostsViewType => {
    return {
        id: post.id,
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
    }
}


export const posts: OldPostsType[] = [
    {
        id: "1",
        title: "string",
        shortDescription: "string",
        content: "string",
        blogId: "1",
        blogName: "string"
    },
    {
        id: "2",
        title: "string",
        shortDescription: "string",
        content: "string",
        blogId: "1",
        blogName: "string"
    },
    {
        id: "3",
        title: "string",
        shortDescription: "string",
        content: "string",
        blogId: "2",
        blogName: "string"
    },
    {
        id: "4",
        title: "string",
        shortDescription: "string",
        content: "string",
        blogId: "2",
        blogName: "string"
    },
    {
        id: "5",
        title: "string",
        shortDescription: "string",
        content: "string",
        blogId: "3",
        blogName: "string"
    },
]

export const postsInMemoryRepository = {
    async findPosts(title: string | undefined | null): Promise<OldPostsViewType[]> {
        let foundPosts: OldPostsViewType[] = posts
        if (title) {
            foundPosts = posts.filter(p => p.title.indexOf(title) > -1)
            return foundPosts.map(getOldPostsViewModel)
        } else {
            return foundPosts.map(getOldPostsViewModel)
        }
    },
    async findPostById(id: string): Promise<OldPostsViewType | undefined> {
        const foundPost = posts.find(p => p.id === id)
        if (foundPost) {
            return foundPost
        } else {
            return undefined
        }
    },
    async createPost(title: string, shortDescription: string, content: string, blogId: string): Promise<OldPostsViewType | undefined> {
        const foundBlogger: OldBloggerViewModel | undefined = bloggers.find(b => b.id === blogId)
        if (foundBlogger) {
            const newPost: OldPostsViewType = {
                id: (+new Date()).toString(), title, shortDescription, content, blogId, blogName: foundBlogger.name
            }
            posts.push(newPost)
            return newPost
        } else {
            return undefined
        }
    },
    async updatePost(postId: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean> {
        const foundPost: OldPostsViewType | undefined = posts.find(p => p.id === postId)
        if (foundPost) {
            foundPost.title = title,
                foundPost.shortDescription = shortDescription,
                foundPost.content = content,
                foundPost.blogId = blogId
            return true
        } else {
            return false
        }
    },
    async deletePost(id: string): Promise<boolean> {
        const foundIndex = posts.findIndex(p => p.id === id)
        if (foundIndex > -1) {
            posts.splice(foundIndex, 1)
            return true
        } else {
            return false
        }
    }
}