import express from "express"
import blogController from "../controllers/blogController.js";
import multer from 'multer';


const storage = multer.diskStorage({
  destination: function (request, file, callback) {
    callback(null, './src/postImages');
  },

  filename: function (request, file, callback) {
    callback(null, Date.now() + file.originalname);
  },
});


const upload = multer({storage: storage, limits: {fieldSize: 25*1024*1024}}).fields([
  {
    name: "postImage", 
    maxCount: 1
  },

  {
    name: "headerImage", 
    maxCount: 1
  }
])

const router = express.Router()

router.post("/createPost", upload, blogController.createPost);
router.get("/getAllPosts", blogController.getPosts);
router.get("/getSinglePost/:id", blogController.getSinglePost);
router.put("/updatePost/:id", upload, blogController.updatePost);
router.delete("/deletePost/:id", blogController.deletePost);



export default router