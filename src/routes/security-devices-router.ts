import {Router, Request, Response} from "express";
import {checkRefreshToken} from "../middlewares/requestValidatorWithExpressValidator";
import {securityDevicesService} from "../domain/sequrity-devices-service";
import {HTTP_STATUSES} from "../utils/utils";

export const securityDevicesRouter = Router({})

securityDevicesRouter.get('/',
    checkRefreshToken,

    async (req: Request, res: Response) => {
        const foundAllDevicesFromUser = await securityDevicesService.findAllActiveSessionFromUser(req.user!.userId)
        // console.log(foundAllDevicesFromUser)
        res.send(foundAllDevicesFromUser)
    })

securityDevicesRouter.delete('/devices',
    checkRefreshToken,

    async (req: Request, res: Response) => {
        const result = await securityDevicesService.deleteAllSessionExcludeCurrent(req.user!.deviceId!)
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    })
