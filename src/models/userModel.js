import mongoose from "mongoose";

const Schema = mongoose.Schema

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },

    lastName: {
        type: String,
        required: true,
    },

    email: {
        type: String, 
        required: true,
    },

    password: {
        type: String, 
        required: true,
    }, 

    repeatPassword: {
        type: String,
        required: true,
    },

    dateCreated: {
        type: Date,
        default: Date.now,
    },

    role: {
        type: String,
        default: "user"
    },


    // for third application
    userName: {
        type: String,
        required: true
    },

    isVerified: {
        type: Boolean,
        default: false,
    },

    googleId: {
        type: String
    },

    provider: {
        type: String,
        required: true
    }
})


export default mongoose.model("User", userSchema)