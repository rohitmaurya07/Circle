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

// Getting All Reels
export const getAllReels = async (req,res)=>{
    try {
        const reels = await Reel.find()
        .populate("user","username profileImage")
        .populate("comments.user","username profileImage")
        .sort({createdAt: -1});

        return res.status(200).json({
            success: true,
            reels,
            message: "Fetched All Reels SuccessFully"
        })        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error while fetching all reels"
        })
    }
}

// Getting Reel by Id
export const getReelById = async (req,res)=>{
    try {
        const reel = await Reel.findById(req.params.id)
        .populate("user","username profileImage")
        .populate("comments.user","username profileImage")
        if (!post) {
            return res.status(400).json({
            success: false,
            message: "reel Not Found By Id"
        }) 
        }
        return res.status(200).json({
            success: true,
            reel,
            message: "Fetched reel SuccessFully"
        })        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error while fetching reel"
        })
    }
}



// Like , Unlike Toggle
export const toggleReelLike = async (req,res) =>{
    try {
        const userId = req.user._id
        const reel = await Reel.findById(req.params.id)
        if (!reel) {
            return res.status(500).json({
            success: false,
            message: "reel Not found"
        })
        }
        const index = reel.likes.indexOf(userId)
        if (index === -1) {
            reel.likes.push(userId)
        }else{
            reel.likes.splice(userId)
        }

        await reel.save()
        return res.status(200).json({
            success: true,
            message: "Reel Liked SuccessFully",
            reel: reel.likes
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error While Liking Reel"
        })
    }
}


// Commenting on Reel
export const commentReel = async (req,res)=>{
    try {
        const {text} = req.body
        const userId = req.user._id
        const reel = await Reel.findById(req.params.id)
        if (!reel) {
            return res.status(500).json({
            success: false,
            message: "Post Not found"
        })
        }

        const comment = {
            user: userId,
            text,
            createdAt: new Date()
        }

        reel.comment.push(comment)
        
        await reel.save()

        const updateReel = await Reel.findById(reel._id).populate(
            "comments.user",
            "username profileImage"
        )
        return res.status(201).json({
            success: true,
            message: "Comment success",
            comment: updateReel.comments
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error While Commenting on Post"
        })
    }
}


// Deleting Reel by Id
export const deleteById = async (req,res)=>{
    try {
        const userId = req.user._id
        const reel = await Reel.findById(req.params.id)
        if (!reel || reel.user.toString() !== userId.toString()) {
            return res.status(400).json({
            success: false,
            message: "Reel Not Found or unauthorized user"
        }) 
        }
        await reel.deleteOne() 
        return res.status(200).json({
            success: true,
            reel,
            message: "Reel deleted SuccessFully"
        })        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error while deleting reel"
        })
    }
}