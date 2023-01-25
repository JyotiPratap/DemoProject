const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId
const userSchema = new mongoose.Schema({

    fname: {
        type: String,
        required: true,
        trim: true
    },
    lname: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    teacherId: {
        type: ObjectId,
        required: true,
        ref: "teacher",
        trim: true
    },

}, { timestamps: true });

module.exports = mongoose.model('User_Project4', userSchema)