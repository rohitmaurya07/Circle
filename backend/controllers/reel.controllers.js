import Reel from "../models/reel.model";

// Creating Reel
export const createReel = async (req,res)=>{
    try {
        const {caption} = req.body;
        const userId = req.user._id;
        if (!req.file || !req.file.path ) {
            return res.status(400).json({
                success: false,
                message: "Reel Not Uploaded"
            })
        }
    
        const mediaUrl = req.file.path;
        const reel = await Reel.create({
            user: userId,
            mediaUrl,
            caption
        })
    
        return res.status(201).json({
            success: true,
            reel,
            message: "Reel Created Successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error while Creatting Post"
        })
    }
}