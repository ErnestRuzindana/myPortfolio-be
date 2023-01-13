import express from "express"
import blogController from "../controllers/blogController.js";

const router = express.Router()

router.post("/createPost", blogController.createPost);
router.get("/getAllPosts", blogController.getPosts);
router.get("/getSinglePost/:id", blogController.getSinglePost);
router.put("/updatePost/:id", blogController.updatePost);
router.delete("/deletePost/:id", blogController.deletePost);
router.put("/createComment/:id", blogController.createComment);
router.get("/getAllComments/:id", blogController.getAllComments);
router.get("/getAllCommentReplies/:id", blogController.getAllCommentReplies);
router.post("/likePost/:blog_id", blogController.likePost);
router.get("/getAllLikes/:id", blogController.getAllLikes);
router.post("/likeComment/:blog_id", blogController.likeComment);
router.get("/getAllCommentLikes/:id", blogController.getAllCommentLikes);
router.put("/commentReply/:id/:commentId", blogController.commentReply);
router.get("/getSingleComment/:id/:commentId", blogController.getSingleComment);

export default router