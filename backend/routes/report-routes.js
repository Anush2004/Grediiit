const express = require('express')
const router = express.Router()

const User = require('../model/user')
const Sub = require('../model/subgreddit')
const Post = require("../model/post")
const Comment = require("../model/comment")
const Report = require("../model/report")


router.post('/create-report/:subName/:postId', async (req, res) => {
  try {

    const { subName, postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    };

    const newReport = new Report({
      reporter_uname: req.session.user.uname,
      reportee_uname: post.uname,
      concern: req.body.concern,
      name: subName,
      postID: postId,
      status: 'Neutral',
      date: Date.now(),
    });

    const result = await newReport.save();


    res.status(200).json({ success: true, result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error creating report" });
  }
});


router.post('/:subName/reports', async (req, res) => {
  try {
    const sub = await Sub.findOne({ name: req.params.subName });
    if (!sub) {
      return res.status(404).json({ msg: 'Sub not found' });
    }

    const reports = await Report.find({ name: sub.name }).populate('postID', 'text');
    res.json(reports);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});



router.patch('/:id/status', async (req, res) => {
  try {

    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    console.log(report.status)
    if (report.status !== 'Neutral') {
      return res.status(400).json({ message: 'Report has already been processed' });
    }
    report.status = req.body.status;
    await report.save();
    if (report.status === 'Blocked') {
      const post = await Post.findById(report.postID);
      post.status = 'blocked';
      await post.save();
      const sub = await Sub.findOne({ name: report.name })
      const postIndex = sub.posts.findIndex(post => post.postID.toString() === report.postID.toString());
      sub.posts[postIndex].status = "blocked";
      const userIndex = sub.users.findIndex(user => user.uname === report.reportee_uname);
      sub.users[userIndex].status = "blocked";
      await sub.save();
      const result = await User.updateOne(
        { uname: report.reportee_uname },
        { $pull: { joinedsubs: { id: sub._id } } }
      );
    }
    res.json(report);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id/delete', async (req, res) => {
  try {

    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    const post = await Post.findById(report.postID);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }


    const result = await Sub.updateOne(
      { name: report.name },
      {
        $pull: { posts: { postID: report.postID } }
      },
    );
    const sub = await Sub.findOne({ name: report.name });
    sub.deletedposts = sub.deletedposts + 1;
    await sub.save();
    
    await Report.deleteMany({ postID: post._id });
    await Comment.deleteMany({ postID: post._id });
    await post.remove();
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});




module.exports = router
