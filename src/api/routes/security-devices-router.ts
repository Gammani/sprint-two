import {Router} from "express";
import {
    checkAndRemoveRefreshTokenById,
    checkRefreshToken
} from "../../middlewares/requestValidatorWithExpressValidator";
import {securityDevicesController} from "../../composition-root";

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
