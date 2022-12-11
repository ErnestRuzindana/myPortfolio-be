import mongoose from "mongoose";

const Schema = mongoose.Schema

const likeSchema = new Schema ({

    blog_id : { type: Schema.Types.ObjectId, ref: "Blog"},
    user_id : { type: Schema.Types.ObjectId, ref: "User"}
    
})

export default mongoose.model("CommentLike", likeSchema);