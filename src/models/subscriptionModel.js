import mongoose from "mongoose";

const Schema = mongoose.Schema

const subscriptionSchema = new Schema ({

    subscriberEmail: {
        type: String,
        required: true
    },

    emailToken: {
        type: String
    },

    isVerified: {
        type: Boolean,
        default: false,
    },

    dateSubscribed: {
        type: Date, 
        default: Date.now
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },
})

export default mongoose.model("Subscription", subscriptionSchema);