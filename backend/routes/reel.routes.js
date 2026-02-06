import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddlewares.js";
import uploadCloudinary from "../middlewares/cloudinaryUpload.js";
import { commentReel, createReel, deleteById, getAllReels, getReelById, toggleReelLike } from "../controllers/reel.controllers.js";
const router = Router()

router.post("/create",
    authMiddleware,uploadCloudinary.single("media"),
    createReel
)
router.get("/all",authMiddleware, getAllReels)
router.get("/:id",authMiddleware, getReelById)
router.delete("/:id",authMiddleware, deleteById)
router.put("/:id/like",authMiddleware,toggleReelLike)
router.post("/:id/comment",authMiddleware,commentReel)

export default router
