import {Router} from 'express';
import * as UserController from './user.controller.js';
import auth from '../../middleware/auth.middleware.js';
import { asyncHandler } from '../../utils/errorHandling.js';
const router = Router();
router.get('/getUsers', asyncHandler(auth),asyncHandler(UserController.getUsers));
export default router;