import mongoose from "mongoose";

const Schema = mongoose.Schema

const contactSchema = new Schema ({
    names: {
        type: String, 
        required: true
    },

    email: {
        type: String, 
        required: true
    },

    phoneNumber: {
        type: Number, 
        required: true
    },

    message: {
        type: String, 
        required: true
    },

    replyMessage: {
        type: String
    },

    subscriberEmail: {
        type: String
    },

    dateCreated: {
        type: Date, 
        default: Date.now
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },
})

export default mongoose.model("Contact", contactSchema);