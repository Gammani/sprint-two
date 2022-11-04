import {PostsType} from "../utils/types";
import {PostViewModel} from "../models/PostViewModel";
import {getPostsViewModel} from "../utils/utils";
import {BloggerViewModel} from "../models/BloggerViewModel";
import {bloggers} from "./bloggers-repository";

export const posts: PostsType[] = [
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

export const postsRepository = {
    findPosts(title: string | undefined | null): PostViewModel[] {
        let foundPosts: PostViewModel[] = posts
        if (title) {
            foundPosts = posts.filter(p => p.title.indexOf(title) > -1)
            return foundPosts.map(getPostsViewModel)
        } else {
            return foundPosts.map(getPostsViewModel)
        }
    },
    findPostById(id: string): PostViewModel | undefined {
        const foundPost = posts.find(p => p.id === id)
        if (foundPost) {
            return foundPost
        } else {
            return undefined
        }
    },
    creatPost(title: string, shortDescription: string, content: string, blogId: string): PostViewModel | undefined {
        const foundBlogger: BloggerViewModel | undefined = bloggers.find(b => b.id === blogId)
        if (foundBlogger) {
            const newPost: PostViewModel = {
                id: (+new Date()).toString(), title, shortDescription, content, blogId, blogName: foundBlogger.name
            }
            posts.push(newPost)
            return newPost
        } else {
            return undefined
        }
    },
    updatePost(postId: string, title: string, shortDescription: string, content: string, blogId: string): boolean {
        const foundPost: PostViewModel | undefined = posts.find(p => p.id === postId)
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
    deletePost(id: string): boolean {
        const foundIndex = posts.findIndex(p => p.id === id)
        if (foundIndex > -1) {
            posts.splice(foundIndex, 1)
            return true
        } else {
            return false
        }
    }
}