const mongoose = require("mongoose")
const uniqueValidator = require('mongoose-unique-validator')
const Post = require('./post')


// Define the Subgreddiit schema
const SubgreddiitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String, // assuming you are storing the image filename as a string
  },
  Mod_uname: {
    type: mongoose.Schema.Types.String,
    ref: 'User'
  },
  dateCreated: {
    type: Date,
    default: Date.now
  },
  tags: [{
    type: String,
    lowercase: true
  }],
  banned: [{
    type: String
  }],

  deletedposts: {
    type: Number,
    default: 0
  },
  users: [{
    status: {
      type: String,
      enum: ['joined', 'blocked', 'requested', 'created', 'left']
    },
    uname: {
      type: mongoose.Schema.Types.String,
      ref: 'User'
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  posts: [{
    postID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    },
    date: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['visible', 'blocked']
    },
  }]

});

// Define the pre-remove hook
SubgreddiitSchema.pre('remove', async function (next) {
  try {
    // Delete all posts in the sub
    await Post.deleteMany({ sub: this._id });
    next();
  } catch (err) {
    next(err);
  }
});

SubgreddiitSchema.plugin(uniqueValidator)
module.exports = mongoose.model('Sub', SubgreddiitSchema)
