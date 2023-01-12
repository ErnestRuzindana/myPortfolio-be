import mongoose from "mongoose";

const Schema = mongoose.Schema

const blogSchema = new Schema({
    title: {
        type: String,
        required: true,
    },

    postBody: {
        type: String,
        required: true
    },

    postImage: {
        public_id: {
          type: String,
          required: true
        },
        url: {
          type: String,
          required: true
        }
    },

    headerImage: {
        public_id: {
          type: String,
          required: true
        },
        url: {
          type: String,
          required: true
        }
    },

    dateCreated: {
        type: String
    },

    authorName: {
        type: String
    },

    authorImage: {
        type: String
    },

    blog_likes:[{
        type: Schema.Types.ObjectId, ref: "BlogLike" 
    }],

    comments:[{
        commentBody: {
            type: String
        },
    
        dateCommented: {
            type: String
        },
    
        commentorName: {
            type: String
        },
    
        commentorImage: {
            type: String
        },
        
        commentReplies:[{
            replyBody: {
                type: String
            },
        
            dateReplied: {
                type: String
            },
        
            replierName: {
                type: String
            },
        
            replierImage: {
                type: String
            }
        }],
        
        comment_likes:[{
            type: Schema.Types.ObjectId, ref: "CommentLike" 
        }],

    }],

    

})


export default mongoose.model("Blog", blogSchema)