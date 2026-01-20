import {Router} from "express"
import { allUsers, loginUser, logoutUser, profileUser, registerUser } from "../controllers/user.controllers";

const router = Router();

router.post("/register",registerUser)
router.post("/login",loginUser)
router.get("/logout",logoutUser)
router.get("/profile",profileUser)
router.get("/all",allUsers)

export default router;