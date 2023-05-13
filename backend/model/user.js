const mongoose = require("mongoose")
const uniqueValidator = require('mongoose-unique-validator')

// Define the User schema
const UserSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: [true, 'provide last name']
    },
    lname: {
        type: String,
        required: [true, 'provide last name']
    },
    email: {
        type: String,
        required: [true, 'provide email'],
        unique: true
    },
    uname: {
        type: String,
        required: [true, 'provide user name'],
    },
    age: {
        type: Number,
        required: [true, 'provide age']
    },
    Cnumber: {
        type: String,
        required: [true, 'provide contact number']
    },
    pass: {
        type: String,
        required: [true, 'provide password']
    },
    savedPosts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }],
    followers: [{
        type: mongoose.Schema.Types.String,
        ref: 'User'
    }],
    following: [{
        type: mongoose.Schema.Types.String,
        ref: 'User'
    }],
    joinedsubs: [{type: String}]
});


UserSchema.plugin(uniqueValidator)

module.exports = mongoose.model('User', UserSchema)

