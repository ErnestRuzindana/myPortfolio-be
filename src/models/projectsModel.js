import mongoose from "mongoose";

const Schema = mongoose.Schema

const projectsSchema = new Schema({

    projectTitle: {
        type: String,
        required: true,
    },

    projectImage: {
        type: String,
        required: true,
    },

    projectLink: {
        type: String,
        required: true,
    }

}, {
    timestamps: true
})


export default mongoose.model("projects", projectsSchema)