import mongoose from "mongoose";

const Schema = mongoose.Schema

const likeSchema = new Schema ({

    user_id : { type: Schema.Types.ObjectId, ref: "User"},
    comment_id : { 
        type: String
    }
    
})

export default mongoose.model("CommentLike", likeSchema);