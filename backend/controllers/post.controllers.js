import Post from "../models/post.model.js";
import User from "../models/user.model.js";


// Creating Post
export const createPost = async (req, res) => {
    try {
        const { caption, mediaType } = req.body;
        const userId = req.user._id;
        if (!req.file || !req.file.path) {
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
        const user = await User.findById(userId)

        if (user) {
            user?.posts.push(post?._id)
            await user.save()
        }

        return res.status(201).json({
            success: true,
            message: "Post Created Successfully",
            post
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error while Creatting Post"
        })
    }
}

// Getting All Posts
export const getAllPosts = async (req, res) => {
    try {

        const posts = await Post.find()
            .populate("user", "username profileImage")
            .populate("comment.user", "username profileImage")
            .sort({ createdAt: -1 });


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

// Getting Post by Id
export const getPostById = async (req, res) => {
    try {

        const post = await Post.findById(req.params.id)
            .populate("user", "username profileImage")
            .populate("comment.user", "username profileImage")
        if (!post) {
            return res.status(400).json({
                success: false,
                message: "Post Not Found By Id"
            })
        }
        return res.status(200).json({
            success: true,
            post,
            message: "Fetched Post SuccessFully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error while fetching Post"
        })
    }
}

// Deleting Post by Id
export const deleteById = async (req, res) => {
    try {
        const userId = req.user._id
        const post = await Post.findById(req.params.id)
        if (!post || post.user.toString() !== userId.toString()) {
            return res.status(400).json({
                success: false,
                message: "Post Not Found or unauthorized user"
            })
        }
        await post.deleteOne()
        return res.status(200).json({
            success: true,
            post,
            message: "Post deleted SuccessFully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error while deleting post"
        })
    }
}

// Like , Unlike Toggle
export const togglePost = async (req, res) => {
    try {
        const userId = req.user._id
        const post = await Post.findById(req.params.id)
        if (!post) {
            return res.status(500).json({
                success: false,
                message: "Post Not found"
            })
        }
        const index = post.likes.indexOf(userId)
        if (index === -1) {
            post.likes.push(userId)
        } else {
            post.likes.splice(index, 1)
        }

        await post.save()
        return res.status(200).json({
            success: true,
            message: "Post Like SuccessFully",
            likes: post.likes
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error While Liking Post"
        })
    }
}

// Commenting Post
export const comment = async (req, res) => {
    try {

        const { text } = req.body
        const userId = req.user._id

        const post = await Post.findById(req.params.id)

        if (!post) {
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
        post.comment.push(comment)

        await post.save()

        const updatePost = await Post.findById(post._id).populate(
            "comment.user",
            "username profileImage"
        )
        return res.status(200).json({
            success: true,
            message: "Comment success",
            comment: updatePost.comment
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error While Commenting on Post"
        })
    }
}

// Save Post
export const toggleSavedPost = async (req, res) => {
    try {
        const userId = req.user._id
        const post = await Post.findById(req.params.id)
        const user = await User.findById(userId)
        if (!user) {
            return res.status(500).json({
                success: false,
                message: "User Not found"
            })
        }
        if (!post) {
            return res.status(500).json({
                success: false,
                message: "Post Not found"
            })
        }
        const postId = post._id
        const index = user.savedPosts.indexOf(postId)
        if (index === -1) {
            user.savedPosts.push(postId)
        } else {
            user.savedPosts.splice(index, 1)
        }

        await user.save()
        return res.status(200).json({
            success: true,
            isSaved: index === -1,
            message: `${index === -1 ? "Post Saved SuccessFully" : "Post Unsaved SuccessFully"}`,
            savedPosts: user.savedPosts
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error While Saving Post"
        })
    }
}