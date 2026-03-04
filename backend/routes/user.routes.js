import {Router} from "express"
import { allUsers, followUser, getProfileById, getSuggestUsers, getUserPosts, getUserSavedPosts, loginUser, logoutUser, profileUser, registerUser, updateProfile, uploadProfile } from "../controllers/user.controllers.js";
import { authMiddleware } from "../middlewares/authMiddlewares.js";
import uploadCloudinary from "../middlewares/cloudinaryUpload.js";

const router = Router();

router.post("/register",registerUser)
router.post("/login",loginUser)
router.get("/logout",logoutUser)
router.post("/follow/:id",authMiddleware, followUser)
router.get("/post/:id",getUserPosts)
router.put("/update-profile",authMiddleware, updateProfile)
router.get("/saved-posts/:id",getUserSavedPosts)
router.get("/suggested/users",authMiddleware, getSuggestUsers)
router.get("/profile",authMiddleware, profileUser)
router.get("/profile/:id",getProfileById)
router.post("/upload-profile",authMiddleware,
    uploadCloudinary.single("profileImage"), uploadProfile)
router.get("/all",allUsers)

export default router;