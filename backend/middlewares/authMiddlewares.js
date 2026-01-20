import jwt from "jsonwebtoken"
import User from "../models/user.model"
export const authMiddleware = async(req,res, next) => {
    try {
        const token = req.cookies.token || req.header("Authorization")?.split(" ")[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized : No Token Found"
            })
        }
        const decode = jwt.verify(token,process.env.JWT_SECRET)
        const user = await User.findById(decode._id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User Not Found"
            })
        }
        req.user = user;
        next()
    } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Error with Middlewres"
            })
    }
}