import {Router} from "express";
import {
    checkAndRemoveRefreshTokenById,
    checkRefreshToken
} from "../../middlewares/requestValidatorWithExpressValidator";
import {container} from "../../composition-root";
import {SecurityDevicesController} from "../controllers/securityDevicesController";



const securityDevicesController = container.resolve(SecurityDevicesController)

export const securityDevicesRouter = Router({})


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
