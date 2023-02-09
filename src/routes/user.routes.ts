import express from 'express';
import validateResource from '../middleware/validateResourse';
import { createUserSchema, forgotPasswordSchema, resetPasswordSchema, verifyUserSchema } from '../schema/user.schema';
import { createuserHandler, forgotPasswordHandler, getCurrentUserHandler, resetPasswordhandler, verifyUserHandler } from '../controller/user.controller';

const router = express.Router();

router.post("/api/users", validateResource(createUserSchema), createuserHandler);
router.post("/api/users/verify/:id/:verificationCode", validateResource(verifyUserSchema), verifyUserHandler);
router.post("/api/users/forgotpassword", validateResource(forgotPasswordSchema), forgotPasswordHandler);
router.post("/api/users/resetpassword/:id/:passwordResetCode", validateResource(resetPasswordSchema), resetPasswordhandler);

router.get('/api/users/me', getCurrentUserHandler)
export default router;