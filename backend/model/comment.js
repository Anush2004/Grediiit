const mongoose = require("mongoose")
const uniqueValidator = require('mongoose-unique-validator')

// Define the Comment schema
const CommentSchema = new mongoose.Schema({
    postID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    },
    text: {
      type: String,
      required: true
    },
    uname: {
      type: mongoose.Schema.Types.String,
      ref: 'User'
    }
  });
  
CommentSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Comment', CommentSchema);
