const express = require('express')
const router = express.Router()

const bcrypt = require('bcrypt')
const User = require('../model/user')
const jwt = require('jsonwebtoken')

require('dotenv').config();


router.post("/login", (req, res) => {
    const { email, pass } = req.body;
    console.log(email, pass)
    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                return res.status(400).json({ success: false, msg: 'User not found' })
            }
            bcrypt.compare(pass, user.pass)
                .then(Match => {
                    if (!Match) {
                        return res.status(400).json({ success: false, msg: 'Incorrect password' });
                    }
                    const token = jwt.sign(
                        { id: user._id },
                        process.env.JWT_KEY,
                        { expiresIn: '1h' }
                    );
                    try {
                        req.session.user = user;
                        res.json({
                            success: true,
                            msg: '',
                            token: `Bearer ${token}`
                        })
                    }
                    catch (error) {
                        console.log("Error", error)
                    }
                })
                .catch(err => {
                    res.status(500).json({ success: false, msg: 'Server error' });
                    console.log(err)
                });
        });
})


router.post('/finduser', async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.session.user._id });
        res.send(user);
    }
    catch (error) {
        console.log(error);
    }
});

router.put('/updateuser', async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.session.user._id, req.body, { new: true })
        console.log(req.session.user)
    }
    catch (error) {
        console.log(error);
    }
})

router.post("/register", async (req, res) => {
    try {
        const existingUser = await User.findOne({ uname: req.body.uname });
        if (existingUser) {
            return res.send({ success: false, message: "Username already taken" });
        }

        const hashedPass = await bcrypt.hash(req.body.pass, 10);
        const newUser = new User({
            userID: req.body.userID,
            fname: req.body.fname,
            lname: req.body.lname,
            uname: req.body.uname,
            email: req.body.email,
            pass: hashedPass,
            age: req.body.age,
            Cnumber: req.body.Cnumber,
        });

        await newUser.save();
        console.log(newUser);
        return res.send({ success: true });
    } catch (err) {
        console.log(err);
        return res.send({ success: false, message: "Error registering user" });
    }
});


router.post('/logout', (req, res) => {
    req.session.destroy(() => {
        res.send({ message: 'Logout successful' });
    });
});

router.get('/following/:postedBy', async (req, res) => {
    try {
        data = {
            success: true,
        }
        if (!req.session.user) {
            throw new Error('You are not logged in');
        }
        const user = await User.findOne({ _id: req.session.user._id });
        const following = user.following;
        if (!following) {
            throw new Error('You are not following any users');
        }
        const postedBy = req.params.postedBy;
        const isFollowing = following.includes(postedBy);
        if (!isFollowing) {
            await User.findOneAndUpdate(
                { uname: req.session.user.uname },
                { $push: { following: postedBy } }
            );
            await User.findOneAndUpdate(
                { uname: postedBy },
                { $push: { followers: req.session.user.uname } }
            );
            data.success = true; // Following
            res.send(data);
        }
        else {
            data.success = false; // Not following
            res.send(data);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }
});

router.patch("/removefollowers/:uname", async (req, res) => {
    try {
        const { uname } = req.params;
       
        // Find user by ID and update saved posts array
        await User.updateOne(
            { _id: req.session.user._id },
            { $pull: { followers: uname } }
        );

        await User.updateOne(
            { uname: uname },
            { $pull: { following: req.session.user.uname } }
        );
        res.status(200).json({ message: 'User follower removed from his list and following list of follower' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.patch("/removefollowing/:uname", async (req, res) => {
    try {
        const { uname } = req.params;
       
        // Find user by ID and update saved posts array
        await User.updateOne(
            { _id: req.session.user._id },
            { $pull: { following: uname } }
        );

        await User.updateOne(
            { uname: uname },
            { $pull: { followers: req.session.user.uname } }
        );
        res.status(200).json({ message: 'User follower removed from his list and following list of follower' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router
