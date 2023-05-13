import {Router, Request, Response} from "express";
import * as os from "os";

export const addressRouter = Router({})

addressRouter.get('/', (req: Request, res: Response) => {
    // const ipAdr = os.networkInterfaces()
    // const ipAdr = req.ip
    const ipAdr = req.connection.address()
    res.send(ipAdr)
})