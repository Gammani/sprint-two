import {SecurityDevicesService} from "../../application/sequrity-devices-service";
import {Request, Response} from "express";
import {HTTP_STATUSES} from "../../utils/utils";
import {inject, injectable} from "inversify";


@injectable()
export class SecurityDevicesController {
    constructor(@inject(SecurityDevicesService) protected securityDevicesService: SecurityDevicesService) {
    }

    async getAllDevicesFromUser(req: Request, res: Response) {
        const foundAllDevicesFromUser = await this.securityDevicesService.findAllActiveSessionFromUser(req.user!.userId)
        res.send(foundAllDevicesFromUser)
    }

    async terminateAllExcludeCurrentSession(req: Request, res: Response) {
        const result = await this.securityDevicesService.deleteAllSessionExcludeCurrent(req.user!.deviceId!)
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }

    async terminateSessionById(req: Request, res: Response) {
        await this.securityDevicesService.deleteCurrentSessionById(req.params.deviceId)
        res.cookie('refreshToken', "", {httpOnly: true, secure: true})
        debugger
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }
}