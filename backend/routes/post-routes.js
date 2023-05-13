const express = require('express')
const router = express.Router()

const User = require('../model/user')
const Sub = require('../model/subgreddit')
const Post = require("../model/post")
const Comment = require("../model/comment")
const Report = require("../model/report")


// Create Post
router.post("/create-post", async (req, res) => {
    try {
        const newPost = new Post({
            text: req.body.text,
            uname: req.session.user.uname,
            name: req.body.postedIn,
            upvotes: 0,
            downvotes: 0,
            date: Date.now(),
            status: 'visible',
        });
        console.log(newPost);
        const sub = await Sub.findOne({ name: req.body.postedIn });
        const bannedWords = sub.banned.map(word => word.toLowerCase());

        const postContentLowercase = newPost.text.toLowerCase();
        const containsBannedWords = bannedWords.some(word =>
            postContentLowercase.includes(word)
        );

        // Replace banned words with asterisks
        const contentWithoutBannedWords = bannedWords.reduce(
            (content, word) => {
                const regex = new RegExp(word, 'gi');
                return content.replace(regex, '*'.repeat(word.length));
            },
            newPost.text
        );

        if (containsBannedWords) {
            res.json({
                containsBannedWords: true,
                content: contentWithoutBannedWords
            });
            newPost.text = contentWithoutBannedWords;
        }
        else {
            res.json({
                containsBannedWords: false,
                content: contentWithoutBannedWords
            });
        }
        const result = await newPost.save();

        console.log(result.name)

        const nPost = { postID: result._id, date: result.date, status: result.status }

        sub.posts.push(nPost);
        await sub.save();

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Error creating post" });
    }
});

// get visible posts of a particular sub
router.get('/:name', async (req, res) => {
    try {
        const posts = await Post.find({ name: req.params.name });
        const modifiedPosts = posts.map(post => {
            if (post.status === "blocked") {
                return {
                    ...post.toObject(),
                    uname: "Blocked User"
                }
            }
            return post;
        });
        res.json(modifiedPosts);
    } catch (e) {
        console.log(e);
    }
});


router.get('/posts/:name', async (req, res) => {
    console.log(req.params.name);
    try {
        const post = await Post.findOne({ _id: req.params.name });
        if (post.status === 'blocked') {
            post.uname = 'Blocked User';
        }
        res.json(post);
    } catch (e) {
        console.log(e);
    }
});


// upvotes
router.post('/:postId/upvote', async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const uname = req.session.user.uname;
        const alreadyUpvoted = post.upvotedby.includes(uname);

        if (alreadyUpvoted) {
            return res.status(400).json({ message: 'User already upvoted this post' });
        }

        post.upvotes += 1;
        post.upvotedby.push(uname);
        await post.save();
        const name = post.status === 'blocked' ? 'Blocked User' : post.uname;
        res.json({ ...post.toObject(), uname: name });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
});



// downvotes
router.post('/:postId/downvote', async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const uname = req.session.user.uname;
        const alreadyDownVoted = post.downvotedby.includes(uname);

        if (alreadyDownVoted) {
            return res.status(400).json({ message: 'User already upvoted this post' });
        }

        post.downvotes += 1;
        post.downvotedby.push(uname);
        await post.save();

        const name = post.status === 'blocked' ? 'Blocked User' : post.uname;
        res.json({ ...post.toObject(), uname: name });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
});
//save posts
router.post('/:postId/savepost', async (req, res) => {
    try {
        const users = req.session.user;
        const user = await User.findOne({ uname: users.uname });

        if (!user) {
            throw new Error('User not found');
        }

        const post = await Post.findById(req.params.postId);
        if (!post) {
            throw new Error('Post not found');
        }

        // Check if the post is blocked
        if (post.status === 'blocked') {
            throw new Error('Post is blocked');
        }

        const Exists = user.savedPosts.includes(post._id);
        if (Exists) {
            return res.status(400).json({ message: 'Post already saved' });
        }

        user.savedPosts.push(post._id);
        await user.save();

        res.json({ message: 'Post saved successfully' });
    } catch (error) {
        console.error(error);

        if (error.message === 'Post is blocked') {
            return res.status(400).json({ message: 'Cannot save a blocked post' });
        }

        res.status(500).send(error);
    }
});


router.post('/savedpost', async (req, res) => {
    try {
        const user1 = req.session.user;
        const user = await User.findOne({ uname: user1.uname }).populate('savedPosts');
        if (!user) {
            return res.status(404).send('User not found');
        }

        res.send(user.savedPosts);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

router.patch('/remove-saved-post/:postId', async (req, res) => {
    try {
        const { postId } = req.params;

        // Find user by ID and update saved posts array
        await User.updateOne(
            { _id: req.session.user._id },
            { $pull: { savedPosts: postId } }
        )

        res.status(200).json({ message: 'Saved post removed from user' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/filter', async (req, res) => {
    try {
        const data = {
            joined: [],
            unjoined: [],
        };

        // Split the tags string into an array and remove whitespace
        const tags = req.body.params.tags.split(',').map(tag => tag.trim());

        const sub = await Sub.find({});
        // Filter the subgreddiit posts by tags
        const filteredSubs = sub.filter(subs => {
            return tags.some(tag => subs.tags.includes(tag));
        });
        const joinedSubs = await Sub.find({ users: { $elemMatch: { uname: req.session.user.uname, status: { $in: ['created', 'joined'] } } } });
        data.joined = filteredSubs.filter(result => joinedSubs.find(joinedSub => joinedSub._id.toString() === result._id.toString()));
        data.unjoined = filteredSubs.filter(result => !joinedSubs.find(joinedSub => joinedSub._id.toString() === result._id.toString())).filter(result => !data.joined.find(joinedSub => joinedSub._id.toString() === result._id.toString()));


        // Return the filtered posts
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.get('/:postId/comment', async (req, res) => {
    try {
        const comments = await Comment.find({ postID: req.params.postId });
        res.json(comments);
    } catch (e) {
        console.log(e);
    }
});

router.post("/create-comment", async (req, res) => {
    try {
        const newComment = new Comment({
            text: req.body.text,
            uname: req.session.user.uname,
            postID: req.body.postID,
        });
        const result = await newComment.save();

        res.status(200).json({ success: true, result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Error creating post" });
    }
});


module.exports = router;