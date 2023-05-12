import {Router, Request, Response} from "express";

export const addressRouter = Router({})

addressRouter.get('/', (req: Request, res: Response) => {
    const ipAdr = req.socket.address()
    res.send(ipAdr)
})