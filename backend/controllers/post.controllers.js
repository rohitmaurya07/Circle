import Post from "../models/post.model";


// Creating Post
export const createPost = async (req,res)=>{
    try {
        const {caption,mediaType} = req.body;
        const userId = req.user._id;
        if (!req.file || !req.file.path ) {
            return res.status(400).json({
                success: false,
                message: "Image Not Uploaded"
            })
        }
    
        const mediaUrl = req.file.path;
        const post = await Post.create({
            user: userId,
            mediaType,
            mediaUrl,
            caption
        })
    
        return res.status(201).json({
            success: true,
            message: "Post Created Successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error while Creatting Post"
        })
    }
}

// Getting All Posts
export const getAllPosts = async (req,res)=>{
    try {
        const posts = await Post.find()
        .populate("user","username profileImage")
        .populate("comments.user","username profileImage")
        .sort({createdAt: -1});

        return res.status(200).json({
            success: true,
            posts,
            message: "Fetched All Posts SuccessFully"
        })        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error while fetching all Posts"
        })
    }
}