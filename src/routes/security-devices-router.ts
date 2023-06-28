import {Router, Request, Response} from "express";
import {checkRefreshToken} from "../middlewares/requestValidatorWithExpressValidator";
import {securityDevicesService} from "../domain/sequrity-devices-service";

export const securityDevicesRouter = Router({})

securityDevicesRouter.get('/',
    checkRefreshToken,

    async (req: Request, res: Response) => {
    const foundAllDevicesFromUser = await securityDevicesService.findAllActiveSessionFromUser(req.user!.userId)
    // console.log(foundAllDevicesFromUser)
    res.send(foundAllDevicesFromUser)
})
