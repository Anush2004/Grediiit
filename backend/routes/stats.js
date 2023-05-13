const express = require('express');
const router = express.Router();
const Sub = require('../model/subgreddit');
const Post = require('../model/post');
const Report = require('../model/report');

// Get subreddit stats
router.get('/:name/stats', async (req, res) => {
    try {
        // Get subreddit information
        const sub = await Sub.findOne({ name: req.params.name });
        if (!sub) {
            return res.status(404).json({ msg: 'Sub not found' });
        }

        // Get growth of the subreddit in terms of members over time
        const memberStats = [];
        let members = sub.users.filter(user => user.status === 'created').length;
        let createdAt = sub.dateCreated;
        memberStats.push({ date: createdAt, members: members });
        sub.users.forEach((user) => {
            if (user.status === 'joined' && user.date > createdAt) {
                members += 1;
                memberStats.push({ date: user.date, members: members });
                createdAt = user.date;
            } else if ((user.status === 'left' || user.status === 'blocked') && user.date > createdAt) {
                members -= 1;
                memberStats.push({ date: user.date, members: members });
                createdAt = user.date;
            }
        });


        // Get number of daily posts
        const postStats = [];
        const subCreatedAt = sub.dateCreated;
        const posts = await Post.find({ name: sub.name }).sort('date');
        let postCount = 0;
        posts.forEach((post) => {
            if (post.date >= subCreatedAt) {
                postCount += 1;
                const date = new Date(post.date.getFullYear(), post.date.getMonth(), post.date.getDate());
                const existingPostStat = postStats.find((postStat) => {
                    return postStat.date.getTime() === date.getTime();
                });
                if (existingPostStat) {
                    existingPostStat.posts += 1;
                } else {
                    postStats.push({ date: date, posts: 1 });
                }
            }
        });

        // Get number of reported posts and actually deleted posts based on reports
        const reportStats = [];
        const reports = await Report.distinct('postID', { name: sub.name });

        
        console.log(reports);
        reportStats.push({ reported: reports.length+sub.deletedposts, deleted: sub.deletedposts })

        res.json({
            memberStats: memberStats,
            postStats: postStats,
            reportStats: reportStats,
        });
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router