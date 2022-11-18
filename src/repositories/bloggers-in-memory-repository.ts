import {BloggersType} from "../utils/types";
import {BloggerViewModel} from "../models/BloggerViewModel";
import {getBloggerViewModel} from "../utils/utils";

export type OldBloggersType = {
    id: string
    name: string
    youtubeUrl: string
}
export type OldBloggerViewModel = {
    id: string
    name: string
    youtubeUrl: string
}
export const getOldBloggerViewModel = (blogger: OldBloggersType): OldBloggerViewModel => {
    return {
        id: blogger.id,
        name: blogger.name,
        youtubeUrl: blogger.youtubeUrl
    }
}

export const bloggers: OldBloggersType[] = [
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

export const bloggersInMemoryRepository = {
    async findBloggers(name: string | null | undefined): Promise<OldBloggerViewModel[]> {
        let foundBloggers: OldBloggerViewModel[] = bloggers
        if (name) {
            foundBloggers = bloggers.filter(b => b.name.indexOf(name) > -1)
            return (foundBloggers.map(getOldBloggerViewModel))
        } else {
            return (foundBloggers.map(getOldBloggerViewModel))
        }
    },
    async findBloggerById(id: string): Promise<OldBloggerViewModel | undefined> {
        const foundBlog: OldBloggerViewModel | undefined = bloggers.find(b => b.id === id)
        if (foundBlog) {
            return getOldBloggerViewModel(foundBlog)
        } else {
            return undefined
        }
    },
    async creatBlogger(name: string, youtubeUrl: string): Promise<OldBloggerViewModel> {
        const newBlogger: OldBloggerViewModel = {id: (+new Date()).toString(), name, youtubeUrl}
        bloggers.push(newBlogger)
        return newBlogger
    },
    async updateBlogger(id: string, name: string, youtubeUrl: string): Promise<boolean> {
        const foundBlogger: OldBloggerViewModel | undefined = bloggers.find(b => b.id === id)
        if (foundBlogger) {
            foundBlogger.name = name
            foundBlogger.youtubeUrl = youtubeUrl
            return true
        } else {
            return false
        }
    },
    async deleteBlogger(id: string): Promise<boolean> {
        const foundIndex: number = bloggers.findIndex(b => b.id === id)
        if (foundIndex > -1) {
            bloggers.splice(foundIndex, 1)
            return true
        } else {
            return false
        }
    }
}