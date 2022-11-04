import {BloggersType} from "../utils/types";
import {BloggerViewModel} from "../models/BloggerViewModel";
import {getBloggerViewModel} from "../utils/utils";

export const bloggers: BloggersType[] = [
    {
        id: "1",
        name: "Leh",
        youtubeUrl: "https://www.youtube.com/"
    },
    {
        id: "2",
        name: "Kao",
        youtubeUrl: "https://www.youtube.com/"
    },
    {
        id: "3",
        name: "Mint",
        youtubeUrl: "https://www.youtube.com/"
    },
]

export const bloggersRepository = {
    findBloggers(name: string | null | undefined): BloggerViewModel[] {
        let foundBloggers: BloggerViewModel[] = bloggers
        if (name) {
            foundBloggers = bloggers.filter(b => b.name.indexOf(name) > -1)
            return (foundBloggers.map(getBloggerViewModel))
        } else {
            return (foundBloggers.map(getBloggerViewModel))
        }
    },
    findBloggerById(id: string): BloggerViewModel | undefined {
        const foundBlog = bloggers.find(b => b.id === id)
        if (foundBlog) {
            return getBloggerViewModel(foundBlog)
        } else {
            return undefined
        }
    },
    creatBlogger(name: string, youtubeUrl: string): BloggerViewModel {
        const newBlogger: BloggerViewModel = {id: (+new Date()).toString(), name, youtubeUrl}
        bloggers.push(newBlogger)
        return newBlogger
    },
    updateBlogger(id: string, name: string, youtubeUrl: string): boolean {
        const foundBlogger: BloggerViewModel | undefined = bloggers.find(b => b.id === id)
        if (foundBlogger) {
            foundBlogger.name = name
            foundBlogger.youtubeUrl = youtubeUrl
            return true
        } else {
            return false
        }
    },
    deleteBlogger(id: string): boolean {
        const foundIndex: number = bloggers.findIndex(b => b.id === id)
        if (foundIndex > -1) {
            bloggers.splice(foundIndex, 1)
            return true
        } else {
            return false
        }
    }
}