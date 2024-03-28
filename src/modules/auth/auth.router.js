import {Router }from 'express';
import * as AuthController from './auth.controller.js';
import validation from '../../middleware/validation.js';
import { signinSchema, signupSchema } from './auth.validation.js';
import { asyncHandler } from '../../utils/errorHandling.js';
const router = Router();
router.post('/signup',validation(signupSchema), AuthController.signup);
router.post('/signin',validation(signinSchema), AuthController.signin);
router.get('/confirmEmail/:token', asyncHandler(AuthController.confirmEmail));
router.get('/newConfirmEmail/:refreshToken', asyncHandler(AuthController.newConfirmEmail))
export default router;