const express = require('express')
const router = express.Router()

const User = require('../model/user')
const Sub = require('../model/subgreddit')
const Post = require("../model/post")
const Comment = require("../model/comment")
const Report = require("../model/report")
const FuzzySearch = require('fuzzy-search');
const fs = require('fs');

const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Create
router.post("/create-sub", upload.single('image'), async (req, res) => {
    try {
        console.log(req.session.user.uname);
        const newSub = new Sub({
            name: req.body.name,
            description: req.body.description,
            Mod_uname: req.session.user.uname,
            tags: JSON.parse(req.body.tags),
            banned: JSON.parse(req.body.banned),
            dateCreated: Date.now(),
            users: [
                {
                    status: "created",
                    uname: req.session.user.uname,
                    date: Date.now(),
                },
            ],
            
        });
        if (req.file && req.file.filename) {
            newSub.image = req.file.filename;
        }

        console.log(newSub);
        const result = await newSub.save();
        res.status(200).json({ success: true, result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Error creating subreddit" });
    }
});


// Get subs created by the user
router.get('/getusersubs', async (req, res) => {
    try {
        const subs = await Sub.find({ Mod_uname: req.session.user.uname });
        res.json(subs);
    } catch (e) {
        console.log(e);
    }
})

// get joined subs of a user
router.get('/joinedsubs', async (req, res) => {
    const uname = req.session.user.uname;

    try {
        const data = {
            joined: [],
            unjoined: [],
            curruser: uname,
        };

        data.joined = await Sub.find({ users: { $elemMatch: { uname, status: { $in: ["created", "joined"] } } } });

        const allSubs = await Sub.find({});
        data.unjoined = allSubs.filter(sub => !data.joined.find(joinedSub => joinedSub._id.toString() === sub._id.toString()));

        res.json(data);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



// List all
router.get('/list-sub', async (req, res) => {
    try {
        const sub = await Sub.find({});
        res.json(sub);
        console.log(sub);

    } catch (e) {
        console.log(e);
    }
})

// List specific
router.get('/subs/:name', async (req, res) => {
    try {
        const sub = await Sub.findOne({ name: req.params.name });
        res.json(sub);
    } catch (e) {
        console.log(e);
    }
})

// Delete sub
router.delete('/delete-sub/:name', async (req, res) => {
    try {
        const sub = await Sub.findOne({ name: req.params.name });
        if (!sub) {
            return res.status(404).json({ message: 'Sub not found' });
        }


        if (sub.image != null) { // Delete the image associated with the subreddit
            const imagePath = `./uploads/${sub.image}`;
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error(err);
                }
            });
        }
        // Delete all posts in the sub
        const posts = await Post.find({ name: sub.name });


        if (posts.length != 0) {
            for (let i = 0; i < posts.length; i++) {
                // Delete all reports for the post
                await Report.deleteMany({ postID: posts[i]._id });
                await Comment.deleteMany({ postID: posts[i]._id });
                // Delete the post
                await posts[i].remove();
            }
        }

        await sub.remove();
        console.log("hi")
        res.json({ message: 'Sub deleted' });
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Server error' });
    }
});

// User list
router.get('/sub-users/:name', async (req, res) => {
    try {
        const sub = await Sub.findOne({ name: req.params.name });
        let data = {
            joined: [],
            blocked: [],
        };

        if (req.session.user && req.session.user.uname === sub.Mod_uname) {
            data.joined = sub.users.filter(user => user.status === "joined").map(user => user.uname);
            data.created = sub.users.filter(user => user.status === "created").map(user => user.uname);
            data.blocked = sub.users.filter(user => user.status === "blocked").map(user => user.uname);
        } else {
            data.joined = sub.users.filter(user => user.status === "joined").map(user => user.uname);
            data.created = sub.users.filter(user => user.status === "created").map(user => user.uname);
        }
        res.json(data);
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Server error' });
    }
});

//user leaving a sub
router.post('/:subName/leave', async (req, res) => {
    try {
        const { subName } = req.params;
        const { username } = req.session.user.uname;

        // Find the subgrediit
        const sub = await Sub.findOne({ name: subName });

        if (!sub) {
            return res.status(404).json({ message: 'Subgrediit not found' });
        }

        // Check if user is already in sub
        const index = sub.users.findIndex(user => user.uname === username);

        if (index === -1) {
            return res.status(404).json({ message: 'User is not in sub' });
        }

        // Check if user is the creator or moderator of the sub
        if (sub.users[index].status === 'created') {
            return res.status(403).json({ message: 'moderator cannot leave sub' });
        }

        sub.users[index].status = 'left'
        await sub.save();

        res.json({ message: 'User left subgrediit' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// user requesting a sub greddiit
router.post('/:subname/join-request', async (req, res) => {
    const subName = req.params.subname;
    const uname = req.session.user.uname;

    try {
        // Check if the user is already joined or blocked in the sub
        const sub = await Sub.findOne({ name: subName });
        const existingUser = sub.users.find(user => String(user.uname) === String(uname));
        if (existingUser && (existingUser.status === 'joined' || existingUser.status === 'blocked' || existingUser.status === 'created' || existingUser.status === 'requested' || existingUser.status === 'left')) {
            return res.status(400).send({ message: 'User is already joined or blocked or left in the sub' });
        }

        // Add a new user entry in the users array with status set to requested
        const newUser = { uname: uname, status: 'requested', date: new Date() };
        sub.users.push(newUser);
        await sub.save();
        console.log(newUser)

        console.log("success")

        // Return a success message
        return res.send({ message: 'Join request sent' });

    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Error in processing request' });
    }
});

// Get all join requests for a subreddit
router.get('/:subName/jr', async (req, res) => {
    try {
        const sub = await Sub.findOne({ name: req.params.subName });
        let data = {
            joinRequests: []
        };

        const mod_uname = req.session.user.uname;
        if (!sub) {
            return res.status(404).send('Sub not found');
        }

        // Only allow moderators to view join requests
        if (sub.Mod_uname.toString() !== mod_uname.toString()) {
            return res.status(401).send('Unauthorized');
        }

        if (req.session.user && req.session.user.uname === sub.Mod_uname) {
            data.joinRequests = sub.users.filter(user => user.status === "requested").map(user => user.uname);
        }

        res.json(data);
        console.log(data)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.put("/:subname/reject-request/:uname", async (req, res) => {
    try {
        const sub = await Sub.findOne({ name: req.params.subname });
        const mod_uname = req.session.user.uname;

        const u = await User.findOne({ uname: req.params.uname });

        // Check if user is a moderator for the sub
        if (sub.Mod_uname.toString() !== mod_uname.toString()) {
            return res.status(403).send("You are not authorized to reject requests for this sub");
        }

        // Find the user entry with uname set to the userid parameter and status set to requested
        const userIndex = sub.users.findIndex((user) => {
            return user.uname.toString() === u.uname.toString() && user.status === 'requested';
        });

        if (userIndex === -1) {
            return res.status(404).send("User not found or not a requested user");
        }

        // Update the status of the user entry to blocked
        sub.users[userIndex].status = "blocked";

        // Save the updated sub document to the database
        await sub.save();

        // Return a success message
        return res.status(200).send("Request rejected successfully");
    } catch (err) {
        console.error(err);
        return res.status(500).send("Internal Server Error");
    }
});

router.put('/:subname/accept-request/:uname', async (req, res) => {
    try {
        const { subname, uname } = req.params;
        const mod_uname = req.session.user.uname;
        console.log("hello")
        // Check if the user is a moderator
        const sub = await Sub.findOne({ name: subname });
        if (!sub) {
            return res.status(404).json({ message: 'Sub not found' });
        }

        if (sub.Mod_uname.toString() !== mod_uname) {
            return res.status(403).json({ message: 'You are not authorized to accept requests' });
        }

        // Find the user with requested status
        const user = sub.users.find(u => u.uname.toString() === uname.toString() && u.status === 'requested');
        if (!user) {
            return res.status(404).json({ message: 'User not found or not requested to join' });
        }

        // Update the user status to joined
        user.status = 'joined';

        // Save the updated sub document
        await sub.save();

        res.status(200).json({ message: 'Join request accepted' });
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Internal server error' });
    }
});



// Get all sub that match a search query
router.get('/search', async (req, res) => {
    const query = req.query.q;
    const data = {
      joined: [],
      unjoined: [],
    };
  
    const sub = await Sub.find({}).exec();
  
    const fuzzy = new FuzzySearch(sub, ['name'], { caseSensitive: false });
    const results = fuzzy.search(query);
    
    const joinedSubs = await Sub.find({ users: { $elemMatch: { uname: req.session.user.uname, status: { $in: ['created', 'joined'] } } } });
    data.joined = results.filter(result => joinedSubs.find(joinedSub => joinedSub._id.toString() === result._id.toString()));
  
    const allSubs = await Sub.find({});
    data.unjoined = results.filter(result => !joinedSubs.find(joinedSub => joinedSub._id.toString() === result._id.toString())).filter(result => !data.joined.find(joinedSub => joinedSub._id.toString() === result._id.toString()));
  
    res.json(data);
  });

module.exports = router