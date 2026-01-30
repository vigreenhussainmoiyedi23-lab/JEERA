const express = require("express");
const upload = require("../../config/multer")
const imagekit = require("../../config/Imagekit");
const postModel = require("../../models/post.model");
const { default: mongoose } = require("mongoose");
const commentModel = require("../../models/comment.model");
const userModel = require("../../models/user.model");
const linkPreview = require("link-preview-js");

const Router = express.Router();

Router.get("/all", async function (req, res) {
    try {
        const user = req.user
        const { limit = 10, offset = 0, visibility } = req.query;

        const filter = { createdBy: user._id };
        if (visibility) {
            filter.visibility = visibility;
        }

        const posts = await postModel.find(filter)
            .populate({
                path: "createdBy",
                select: "username email profilePic headline"
            })
            .populate({
                path: "mentions",
                select: "username profilePic"
            })
            .sort({ createdAt: -1, isPinned: -1 })
            .limit(parseInt(limit))
            .skip(parseInt(offset));

        const total = await postModel.countDocuments(filter);

        // Increment views for all posts being sent (except own posts - optional)
        const postIds = posts.map(p => p._id);
        if (postIds.length > 0) {
            // Only increment views if it's not the post owner viewing their own posts
            // Uncomment the line below if you want to track views even for own posts
            await postModel.updateMany({ _id: { $in: postIds } }, { $inc: { "engagement.views": 1 } });
        }

        return res.status(200).json({
            message: "All User Posts",
            posts,
            pagination: {
                total,
                limit: parseInt(limit),
                offset: parseInt(offset),
                hasMore: total > parseInt(offset) + parseInt(limit)
            }
        })
    } catch (error) {
        return res.status(500).json({ message: "Something went Wrong", error })
    }
})

Router.post("/create", async (req, res) => {
    const user = req.user
    console.log(req.body)
    if(!req.body)return res.status(500).json({message:"Body is empty"})
    try {
        const { content, title, visibility, hashtags, mentions, tags, industry, location, linkUrl, poll, article } = req.body

        if (!content || content.trim().length === 0) {
            return res.status(400).json({ message: "Content is required" })
        }

        // Media uploads are disabled - no file processing

        // Parse JSON fields
        let parsedHashtags = [];
        let parsedMentions = [];
        let parsedTags = [];
        let parsedPoll = null;
        let parsedArticle = null;

        try {
            if (hashtags) parsedHashtags = JSON.parse(hashtags);
            if (mentions) parsedMentions = JSON.parse(mentions);
            if (tags) parsedTags = JSON.parse(tags);
            if (poll) parsedPoll = JSON.parse(poll);
            if (article) parsedArticle = JSON.parse(article);
        } catch (e) {
            console.error("Error parsing JSON fields:", e);
        }

        // Extract hashtags from content
        const contentHashtags = content.match(/#\w+/g)?.map(tag => tag.substring(1).toLowerCase()) || [];
        const allHashtags = [...new Set([...contentHashtags, ...parsedHashtags])];

        // Extract mentions from content
        const contentMentions = content.match(/@\w+/g)?.map(mention => mention.substring(1)) || [];
        const mentionedUsers = await userModel.find({
            username: { $in: contentMentions }
        }).select('_id');
        const allMentions = [...new Set([...mentionedUsers.map(u => u._id.toString()), ...parsedMentions])];

        // Handle link preview
        let linkPreviewData = null;
        if (linkUrl) {
            try {
                const preview = await linkPreview(linkUrl);
                linkPreviewData = {
                    url: linkUrl,
                    title: preview.title,
                    description: preview.description,
                    image: preview.images?.[0],
                    siteName: preview.siteName
                };
            } catch (e) {
                console.error("Error generating link preview:", e);
                // Fallback to basic link info
                try {
                    const url = new URL(linkUrl);
                    linkPreviewData = {
                        url: linkUrl,
                        title: url.hostname,
                        description: linkUrl,
                        image: null,
                        siteName: url.hostname
                    };
                } catch (urlError) {
                    linkPreviewData = {
                        url: linkUrl,
                        title: "Link",
                        description: linkUrl,
                        image: null,
                        siteName: "External Link"
                    };
                }
            }
        }

        // Create post
        const postData = {
            content,
            title,
            createdBy: user._id,
            media: [], // Media uploads disabled
            hashtags: allHashtags,
            mentions: allMentions,
            visibility: visibility || "public",
            tags: parsedTags,
            industry,
            location,
            linkPreview: linkPreviewData,
            engagement: {
                likes: [],
                comments: [],
                shares: [],
                views: 0,
                clicks: 0
            }
        };

        if (parsedPoll && parsedPoll.question) {
            postData.poll = {
                question: parsedPoll.question,
                options: parsedPoll.options || [],
                expiresAt: parsedPoll.expiresAt ? new Date(parsedPoll.expiresAt) : undefined,
                allowMultipleChoice: parsedPoll.allowMultipleChoice || false
            };
        }

        if (parsedArticle && parsedArticle.title) {
            postData.article = {
                title: parsedArticle.title,
                content: parsedArticle.content,
                coverImage: parsedArticle.coverImage,
                readTime: parsedArticle.readTime || Math.ceil(parsedArticle.content?.length / 1000) || 1,
                isPublished: parsedArticle.isPublished !== false
            };
        }

        const post = await postModel.create(postData);
        const populatedPost = await post.populate([
            { path: "createdBy", select: "username email profilePic headline" },
            { path: "mentions", select: "username profilePic" }
        ]);

        // Update user's posts array
        user.posts.push(post._id);
        await user.save();

        return res.status(201).json({
            message: "Post created successfully",
            post: populatedPost
        });
    } catch (error) {
        console.error("Post creation error:", error);
        return res.status(500).json({ message: "An error occurred", error: error.message })
    }
})

Router.delete("/delete/:postId", async (req, res) => {
    try {
        const user = req.user
        const post = await postModel.findOneAndDelete({ _id: req.params.postId })
        if (!post) {
            return res.status(400).json({ message: " post not found" })
        }
        post.media.map(i => {
            imagekit.deleteFile(i.fileId)
        })

        return res.status(200).json({
            message: "post deleted succesfully",
        })
    } catch (error) {
        return res.status(500).json({ message: "an error occured", error })
    }
})

Router.patch("/update/:postId", async (req, res) => {
    const user = req.user

    try {
        const { title, description } = req.body
        if (!title || !description) {
            return res.status(400).json({ message: "title and description Both are required" })
        }
        const post = await postModel.findOneAndUpdate({ _id: req.params.postId }, {
            title,
            description
        }, {
            new: true
        })
        const populatedPost = await post.populate("createdBy", "username email");
        user.posts.push(post._id)
        return res.status(200).json({
            message: "post updated succesfully",
            post: populatedPost
        })
    } catch (error) {
        return res.status(500).json({ message: "an error occured", error })
    }
})

Router.post("/feed", async (req, res) => {
    try {
        // Get post IDs already sent from frontend
        const postsAlreadySent = req.body?.postIds || [];

        // Convert to ObjectId
        const excludedIds = postsAlreadySent.map((id) =>
            new mongoose.Types.ObjectId(id)
        );

        // Get random posts excluding the sent ones
        const posts = await postModel.aggregate([
            {
                $match: {
                    _id: { $nin: excludedIds },
                },
            },
            { $sample: { size: 12 } }, // pick 12 random posts
        ]);

        // Populate 'createdBy' field (aggregate result doesn’t have populate)
        const populatedPosts = await postModel.populate(posts, {
            path: "createdBy",
            select: "username email profilePic",
        });

        // Increment views for all posts being sent (excluding own posts)
        const postIds = populatedPosts.map((p) => p._id);
        if (postIds.length > 0) {
            // Only increment views for posts not created by the current user
            await postModel.updateMany(
                {
                    _id: { $in: postIds },
                    createdBy: { $ne: req.user._id } // Exclude own posts
                },
                {
                    $inc: { "engagement.views": 1 },
                    $set: { lastActivityAt: new Date() }
                }
            );
        }

        // Extract the IDs so frontend can track what's sent
        const postIdsForFrontend = populatedPosts.map((p) => p._id);

        res.status(200).json({
            success: true,
            message: "Here are some random posts ",
            posts: populatedPosts,
            postIds: postIdsForFrontend,
        });
    } catch (error) {
        console.error(" Error fetching random feed:", error.message);
        res.status(500).json({
            success: false,
            message: "Could not load feed",
            error: error.message,
        });
    }
});

Router.patch("/likeUnlike/:postId", async function (req, res) {
    try {
        const user = req.user
        const { postId } = req.params

        const post = await postModel.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const userIdStr = user._id.toString();
        const likeIndex = post.engagement.likes.findIndex(id => id.toString() === userIdStr);

        if (likeIndex === -1) {
            post.engagement.likes.push(user._id);
        } else {
            post.engagement.likes.splice(likeIndex, 1);
        }

        post.lastActivityAt = new Date();
        await post.save();

        return res.status(200).json({
            message: likeIndex === -1 ? "Post liked" : "Post unliked",
            liked: likeIndex === -1,
            likeCount: post.engagement.likes.length
        });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong", error: error.message })
    }
})

Router.patch("/vote/:postId", async function (req, res) {
    try {
        const user = req.user
        const { postId } = req.params
        const { optionIndex } = req.body

        if (typeof optionIndex !== "number" || optionIndex < 0) {
            return res.status(400).json({ message: "Invalid option index" });
        }

        const post = await postModel.findById(postId);
        if (!post || !post.hasPoll) {
            return res.status(404).json({ message: "Poll not found" });
        }

        if (optionIndex >= post.poll.options.length) {
            return res.status(400).json({ message: "Option index out of range" });
        }

        const userIdStr = user._id.toString();

        // Remove vote from all options if multiple choice is not allowed
        if (!post.poll.allowMultipleChoice) {
            post.poll.options.forEach(option => {
                const voteIndex = option.votes.findIndex(id => id.toString() === userIdStr);
                if (voteIndex !== -1) {
                    option.votes.splice(voteIndex, 1);
                }
            });
        }

        // Add vote to selected option
        const targetOption = post.poll.options[optionIndex];
        const existingVoteIndex = targetOption.votes.findIndex(id => id.toString() === userIdStr);

        if (existingVoteIndex === -1) {
            targetOption.votes.push(user._id);
        }

        post.lastActivityAt = new Date();
        await post.save();

        // Calculate vote percentages
        const totalVotes = post.poll.options.reduce((sum, opt) => sum + opt.votes.length, 0);
        const optionsWithPercentages = post.poll.options.map(opt => ({
            text: opt.text,
            votes: opt.votes.length,
            percentage: totalVotes > 0 ? Math.round((opt.votes.length / totalVotes) * 100) : 0,
            hasVoted: opt.votes.some(id => id.toString() === userIdStr)
        }));

        return res.status(200).json({
            message: "Vote recorded successfully",
            poll: {
                question: post.poll.question,
                options: optionsWithPercentages,
                totalVotes,
                allowMultipleChoice: post.poll.allowMultipleChoice,
                expiresAt: post.poll.expiresAt
            }
        });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong", error: error.message })
    }
})

Router.patch("/click/:postId", async function (req, res) {
    try {
        const user = req.user
        const { postId } = req.params

        const post = await postModel.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Increment click counter
        post.engagement.clicks = (post.engagement.clicks || 0) + 1;
        post.lastActivityAt = new Date();
        await post.save();

        return res.status(200).json({
            message: "Click tracked successfully",
            clicks: post.engagement.clicks
        });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong", error: error.message })
    }
})

Router.patch("/view/:postId", async function (req, res) {
    try {
        const user = req.user
        const { postId } = req.params

        const post = await postModel.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Don't track views for own posts
        if (post.createdBy.toString() === user._id.toString()) {
            return res.status(200).json({
                message: "Own post view not tracked",
                views: post.engagement.views || 0
            });
        }

        // Check if user already viewed this post in the last hour (to prevent duplicate tracking)
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        const recentView = post.engagement.viewEvents.find(
            event => event.user.toString() === user._id.toString() &&
                new Date(event.timestamp) > oneHourAgo
        );

        if (!recentView) {
            // Add view event
            post.engagement.viewEvents.push({
                user: user._id,
                timestamp: new Date()
            });

            // Increment view counter
            post.engagement.views = (post.engagement.views || 0) + 1;
            post.lastActivityAt = new Date();
        }

        await post.save();

        return res.status(200).json({
            message: "View tracked successfully",
            views: post.engagement.views
        });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong", error: error.message })
    }
})

module.exports = Router;