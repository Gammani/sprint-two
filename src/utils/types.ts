import {Request} from 'express'

export type RequestWithBody<T> = Request<{}, {}, T>
export type RequestWithQuery<T> = Request<{}, {}, {}, T>
export type RequestWithParams<T> = Request<T>
export type RequestWithParamsAndBody<T, Y> = Request<T, {}, Y>



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

type ErrorsMessageType = {
    message: string
    field: string
}
export type ErrorsType = {
    errorsMessages: Array<ErrorsMessageType>
}