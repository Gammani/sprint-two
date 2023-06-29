import {Router, Request, Response} from "express";
import {
    checkAndRemoveRefreshTokenById,
    checkAndUpdateRefreshToken,
    checkRefreshToken
} from "../middlewares/requestValidatorWithExpressValidator";
import {securityDevicesService} from "../domain/sequrity-devices-service";
import {HTTP_STATUSES} from "../utils/utils";
import {expiredTokensRepository} from "../repositories/expiredTokens-db-repository";

export const securityDevicesRouter = Router({})

securityDevicesRouter.get('/',
    checkRefreshToken,

    async (req: Request, res: Response) => {
        const foundAllDevicesFromUser = await securityDevicesService.findAllActiveSessionFromUser(req.user!.userId)
        // console.log(foundAllDevicesFromUser)
        res.send(foundAllDevicesFromUser)
    })

securityDevicesRouter.delete('/',
    checkRefreshToken,

    async (req: Request, res: Response) => {
        const result = await securityDevicesService.deleteAllSessionExcludeCurrent(req.user!.deviceId!)
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    })

securityDevicesRouter.delete('/:deviceId',
    checkAndRemoveRefreshTokenById,

    async (req: Request, res: Response) => {
    const device = await securityDevicesService.findDeviceByDeviceId(req.params.deviceId)
        if(device) {
            if(req.params.deviceId === req.user!.deviceId) {
                await securityDevicesService.deleteCurrentSessionById(req.params.id)
                res.cookie('refreshToken', "", {httpOnly: true, secure: true})
                res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
            } else {
                res.sendStatus(HTTP_STATUSES.FORBIDDEN_403)
            }
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }
    })
