import Story from "../models/story.model.js";


// Creating Story
export const createStory = async (req, res) => {
    try {
        const { mediaType } = req.body;
        const userId = req.user._id;
        if (!req.file || !req.file.path) {
            return res.status(400).json({
                success: false,
                message: "Story Not Found"
            })
        }

        const mediaUrl = req.file.path;
        const story = await Story.create({
            user: userId,
            mediaType,
            mediaUrl
        })

        return res.status(201).json({
            success: true,
            message: "Story Uploaded Successfully",
            story
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error while Creatting Story"
        })
    }
}

// Getting All stories
export const getAllStories = async (req, res) => {
    try {

        const now = new Date();
        const userId = req.user?._id
        const stories = await Story.find({ expireAt: { $gt: now }, user: { $ne: userId } })
            .populate("user", "username profileImage")
            .populate({ path: "comments.user", select: "username profileImage" })
            .populate("viewers", "username profileImage")
            .sort({ createdAt: -1 });

        const storiesByUser = stories.reduce((acc, story) => {

            if (!story?.user) return acc;

            const authorId = story.user._id.toString(); // Use distinct variable for author
            if (!acc[authorId]) {
                acc[authorId] = {
                    user: story.user,
                    stories: [],
                    isUnViewed: false
                }
            }
            // Check if current user (userId from outer scope) has viewed
            if (userId) {
                const hasViewed = story.viewers.some(
                    (view) => view?._id.toString() === userId.toString()
                )
                if (!hasViewed) {
                    acc[authorId].isUnViewed = true; // Set flag instead of overwriting object
                }
            }
            acc[authorId].stories.push(story);
            return acc;
        }, {})

        const userStories = await Story.find({
            user: userId,
            expireAt: { $gt: now }
        })
            .populate("user", "username profileImage")
            .populate({ path: "comments.user", select: "username profileImage" })
            .populate("viewers", "username profileImage")
            .sort({ createdAt: -1 });

        if (userStories.length > 0) {
            storiesByUser[userId] = {
                user: req.user,
                stories: userStories,
                // isUnViewed = false,
                isOwn: true,
            }
        }

        const storyArray = Object.values(storiesByUser)
        const sortedStories = storyArray.sort((a, b) => {
            if (a.isOwn) return -1
            if (b.isOwn) return 1
            // if (a.isUnViewed && !b.isUnViewed) return -1
            // if (!a.isUnViewed && b.isUnViewed) return 1
            return 0
        })

        return res.status(200).json({
            success: true,
            stories: sortedStories,
            message: "Fetched All Stories SuccessFully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error while fetching all Stories"
        })
    }
}

// View Story
export const viewStory = async (req, res) => {

    try {
        const { id } = req.params
        const userId = req.user._id
        const story = await Story.findById(id)
        if (!story) {
            return res.status(400).json({
                message: "Story Not FOund",
                success: false
            })
        }
        if (!story.viewers.includes(userId)) {
            story.viewers.push(userId)
            await story.save()
        }

        return res.status(200).json({
            success: true,
            message: "Story Viewed Success"
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error while viewing Story"
        })
    }
}



// Like , Unlike Toggle for Story
export const toggleStoryLike = async (req, res) => {
    try {
        const userId = req.user._id
        const story = await Story.findById(req.params.id)
        if (!story) {
            return res.status(500).json({
                success: false,
                message: "Story Not found"
            })
        }
        const index = story.likes.indexOf(userId)
        if (index === -1) {
            story.likes.push(userId)
        } else {
            story.likes.splice(index, 1)
        }

        await story.save()
        return res.status(200).json({
            success: true,
            message: "Story Like SuccessFully",
            story: story.likes
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error While Liking Story"
        })
    }
}

// Commenting on Story
export const commentOnStory = async (req, res) => {
    try {
        const { text } = req.body
        const userId = req.user._id
        const story = await Story.findById(req.params.id)
        if (!story) {
            return res.status(500).json({
                success: false,
                message: "Post Not found"
            })
        }

        const comment = {
            user: userId,
            text,
        }
        story.comments.push(comment)

        await story.save()

        const updateStory = await Story.findById(story._id).populate(
            "comments.user",
            "username profileImage"
        )
        return res.status(200).json({
            success: true,
            message: "Comment success",
            comments: updateStory.comments
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error While Commenting on Story"
        })
    }
}


// Deleting Story by Id
export const deleteStoryById = async (req, res) => {
    try {
        const userId = req.user._id
        const story = await Story.findById(req.params.id)
        if (!story || story.user.toString() !== userId.toString()) {
            return res.status(400).json({
                success: false,
                message: "Story Not Found or unauthorized user"
            })
        }
        await story.deleteOne()
        return res.status(200).json({
            success: true,
            message: "Story deleted SuccessFully",
            story
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error while deleting Story"
        })
    }
}   