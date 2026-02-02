import { Router } from "express";
import { comment, createPost, deleteById, getAllPosts, getPostById, togglePost } from "../controllers/post.controllers";
import { authMiddleware } from "../middlewares/authMiddlewares";
import uploadCloudinary from "../middlewares/cloudinaryUpload";
const router = Router()

router.post("/create",
    authMiddleware,uploadCloudinary.single("media"),
    createPost
)
router.get("/getallposts",authMiddleware, getAllPosts)
router.get("/:id",authMiddleware, getPostById)
router.delete("/:id",authMiddleware, deleteById)
router.put("/:id/like",authMiddleware,togglePost)
router.post("/:id/comment",authMiddleware,comment)

export default router
