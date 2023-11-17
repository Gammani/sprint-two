import {Request, Response, Router} from "express";
import {checkAndRemoveRefreshTokenById, checkRefreshToken} from "../middlewares/requestValidatorWithExpressValidator";
import {HTTP_STATUSES} from "../utils/utils";
import {SecurityDevicesService} from "../application/sequrity-devices-service";

export const securityDevicesRouter = Router({})


class SecurityDevicesController {
    private securityDevicesService: SecurityDevicesService

    constructor() {
        this.securityDevicesService= new SecurityDevicesService()
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

const securityDevicesController = new SecurityDevicesController()

securityDevicesRouter.get('/',
    checkRefreshToken,
    securityDevicesController.getAllDevicesFromUser.bind(securityDevicesController)
)
securityDevicesRouter.delete('/',
    checkRefreshToken,
    securityDevicesController.terminateAllExcludeCurrentSession.bind(securityDevicesController)
)
securityDevicesRouter.delete('/:deviceId',
    checkAndRemoveRefreshTokenById,
    securityDevicesController.terminateSessionById.bind(securityDevicesController)
)




// securityDevicesRouter.get('/',
//     checkRefreshToken,
//
//     async (req: Request, res: Response) => {
//         const foundAllDevicesFromUser = await securityDevicesService.findAllActiveSessionFromUser(req.user!.userId)
//         // console.log(foundAllDevicesFromUser)
//         res.send(foundAllDevicesFromUser)
//     })
//
// securityDevicesRouter.delete('/',
//     checkRefreshToken,
//
//     async (req: Request, res: Response) => {
//         const result = await securityDevicesService.deleteAllSessionExcludeCurrent(req.user!.deviceId!)
//         res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
//     })
//
// securityDevicesRouter.delete('/:deviceId',
//     checkAndRemoveRefreshTokenById,
//
//     async (req: Request, res: Response) => {
//         // const device = await securityDevicesService.findDeviceByDeviceId(req.params.deviceId)
//         //     debugger
//         //     if(device) {
//         //         if(req.params.deviceId === req.user!.deviceId) {
//         //             debugger
//         //             await securityDevicesService.deleteCurrentSessionById(req.params.id)
//         //             res.cookie('refreshToken', "", {httpOnly: true, secure: true})
//         //             debugger
//         //             res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
//         //         } else {
//         //             debugger
//         //             res.sendStatus(HTTP_STATUSES.FORBIDDEN_403)
//         //         }
//         //     } else {
//         //         res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
//         //     }
//
//
//         await securityDevicesService.deleteCurrentSessionById(req.params.deviceId)
//         res.cookie('refreshToken', "", {httpOnly: true, secure: true})
//         debugger
//         res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
//     })
