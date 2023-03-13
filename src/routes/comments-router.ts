import {Router, Request, Response} from "express";

export const commentsRouter = Router({})

commentsRouter.put('/:commentId', (req: Request, res: Response) => {
    res.send("comment add")
})
commentsRouter.delete('/:commentId', (req: Request, res: Response) => {
    res.send("comment delete")
})
commentsRouter.get('/:id', (req: Request, res: Response) => {
    res.send("return comment if he searching")
})