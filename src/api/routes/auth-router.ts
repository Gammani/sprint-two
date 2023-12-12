import {Router} from "express";
import {
    authLoginValidation,
    authNewPasswordValidation,
    authRegistrationConfirmationValidation,
    authRegistrationEmailResendingValidation,
    authRegistrationValidation,
    checkAndUpdateRefreshToken,
    checkedConfirmedEmail,
    checkedExistsForLoginOrEmail,
    checkedValidation
} from "../../middlewares/requestValidatorWithExpressValidator";
import {authBearerMiddleware} from "../../middlewares/auth-middleware";
import {restrictionRequests} from "../../middlewares/restriction-requests";
import {container} from "../../composition-root";
import {AuthController} from "../controllers/authController";


const authController = container.resolve(AuthController)

export const authRouter = Router({})


authRouter.post('/login',
    authLoginValidation,
    restrictionRequests,
    checkedValidation,
    authController.login.bind(authController)
)
authRouter.post('/registration',
    authRegistrationValidation,
    restrictionRequests,
    checkedValidation,
    checkedExistsForLoginOrEmail,
    authController.registration.bind(authController)
)
authRouter.post('/password-recovery',
    authRegistrationEmailResendingValidation,
    restrictionRequests,
    checkedValidation,
    authController.passwordRecovery.bind(authController)
)
authRouter.post('/registration-confirmation',
    authRegistrationConfirmationValidation,
    restrictionRequests,
    checkedValidation,
    authController.registrationConfirmation.bind(authController)
)
authRouter.post('/registration-email-resending',
    authRegistrationEmailResendingValidation,
    restrictionRequests,
    checkedValidation,
    checkedConfirmedEmail,
    authController.registrationEmailResending.bind(authController)
)
authRouter.post('/refresh-token',
    checkAndUpdateRefreshToken,
    authController.refreshToken.bind(authController)
)
authRouter.post('/logout',
    checkAndUpdateRefreshToken,
    authController.logout.bind(authController)
)
authRouter.post('/new-password',
    authNewPasswordValidation,
    restrictionRequests,
    checkedValidation,
    authController.newPassword.bind(authController)
)
authRouter.get('/me',
    authBearerMiddleware,
    authController.me.bind(authController)
)

