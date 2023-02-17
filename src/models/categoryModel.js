import mongoose from "mongoose";

const Schema = mongoose.Schema

const categorySchema = new Schema ({

    slug: {
        type: String
    },
    
    name: {
        type: String
    }
    
})

export default mongoose.model("Category", categorySchema);