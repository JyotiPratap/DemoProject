const mongoose = require('mongoose')
mongoose.set('strictQuery', false);

const { Schema } = mongoose;
const userSchema = new Schema({

    fname: {
        type: String,
        required:true
    },
    lname: {
        type: String,
        required: true
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
        required:true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });

module.exports = mongoose.model('User_Pro1', userSchema)