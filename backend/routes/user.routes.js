import {Router} from "express"
import { allUsers, loginUser, logoutUser, profileUser, registerUser, uploadProfile } from "../controllers/user.controllers";
import { authMiddleware } from "../middlewares/authMiddlewares";
import uploadCloudinary from "../middlewares/cloudinaryUpload";

const router = Router();

router.post("/register",registerUser)
router.post("/login",loginUser)
router.get("/logout",logoutUser)
router.get("/profile",authMiddleware, profileUser)
router.post("/upload-profile",authMiddleware,
    uploadCloudinary.single("profileImage"), uploadProfile)
router.get("/all",allUsers)

export default router;