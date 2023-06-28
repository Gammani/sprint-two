import {Router, Request, Response} from "express";
import {checkRefreshToken} from "../middlewares/requestValidatorWithExpressValidator";

export const securityDevicesRouter = Router({})

securityDevicesRouter.get('/',
    checkRefreshToken,

    async (req: Request, res: Response) => {
    console.log(req.user)
    res.send('hey')
})
