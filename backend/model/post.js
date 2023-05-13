const mongoose = require("mongoose")
const Report=require("./report");


const PostSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  uname: {
    type: mongoose.Schema.Types.String,
    ref: 'User'
  },
  
  name: {
    type: mongoose.Schema.Types.String,
    ref: 'Subgreddiit'
  },
  upvotes: {
    type: Number,
    default: 0
  },
  upvotedby: {
    type: [mongoose.Schema.Types.String],
    ref: 'User'
  },
  downvotes: {
    type: Number,
    default: 0
  },
  downvotedby: {
    type: [mongoose.Schema.Types.String],
    ref: 'User'
  },
  date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['visible','blocked']
  }
});

PostSchema.pre('remove', async function (next) {
  try {
    await Report.deleteMany({ postID: this._id });
    next();
  } catch (error) {
    next(error);
  }
});



module.exports = mongoose.model('Post', PostSchema);
