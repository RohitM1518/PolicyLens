import {registerUser,loginUser,logoutUser,changePassword,updateUserProfile,getUserProfile,refreshAccessToken} from '../controllers/userController.js';
import { Router } from 'express';
import {authUserMiddleware} from '../middlewares/authUserMiddleware.js';
const router = Router();
// Unsecured Routes
router.post('/register', registerUser);
router.post('/login', loginUser);

//Secured Routes
router.use(authUserMiddleware);
router.get('/profile', getUserProfile);
router.delete('/logout', logoutUser);
router.put('/profile', updateUserProfile);
router.put('/change-password', changePassword);
router.get('/refresh-token', refreshAccessToken);
export default router;
