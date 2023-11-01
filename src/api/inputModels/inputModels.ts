import {Request} from "express";

export type RequestWithBody<T> = Request<{}, {}, T>
export type RequestWithQuery<T> = Request<{}, {}, {}, T>
export type RequestWithParams<T> = Request<T>
export type RequestWithParamsAndQuery<T, Y> = Request<T, {}, {}, Y>
export type RequestWithParamsAndBody<T, Y> = Request<T, {}, Y>