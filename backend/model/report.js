const mongoose = require("mongoose")
const uniqueValidator = require('mongoose-unique-validator')


// Define the Report schema
const ReportSchema = new mongoose.Schema({
    reporter_uname: {
      type: mongoose.Schema.Types.String,
      ref: 'User'
    },
    reportee_uname: {
      type: mongoose.Schema.Types.String,
      ref: 'User'
    },
    concern: {
      type: String
    },
    name: {
      type: mongoose.Schema.Types.String,
      ref: 'Subgreddiit'
    },
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
      enum: ['Neutral', 'Ignored', 'Blocked']
    }
  });
  
ReportSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Report', ReportSchema);
