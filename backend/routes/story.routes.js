import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddlewares.js";
import uploadCloudinary from "../middlewares/cloudinaryUpload.js";
import { commentOnStory, createStory, deleteStoryById, getAllStories, toggleStoryLike, viewStory } from "../controllers/story.controllers.js";
const router = Router()

router.post("/create",
    authMiddleware,uploadCloudinary.single("media"),
    createStory
)
router.get("/all",authMiddleware, getAllStories)
router.get("/:id/view",authMiddleware, viewStory)
router.delete("/:id",authMiddleware, deleteStoryById)
router.put("/:id/like",authMiddleware,toggleStoryLike)
router.post("/:id/comment",authMiddleware,commentOnStory)

export default router
