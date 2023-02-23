import express from "express";
import UserCreated from "../controllers/registerController.js"
import adminAuth from "../middlewares/adminAuth.js";


const router = express.Router()

router.post("/createUser", UserCreated.createNewUser)
router.post("/emailRegisteredUsers", UserCreated.emailRegisteredUsers)
router.get("/getRegisteredUsers", UserCreated.getAllUsers)
router.get("/verifyEmail", UserCreated.verifyEmail)
router.put("/assignUserRole/:id", adminAuth.authAdmin, UserCreated.assignUserRole)
router.get("/getSingleUser/:id", UserCreated.getUserById)


export default router