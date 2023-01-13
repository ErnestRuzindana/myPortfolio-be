import express from "express"
import loginController from "../controllers/loginController.js"


const router = express.Router()

router.post("/loginUser", loginController.loginUser)

router.post("/forgotPassword", loginController.forgotPassword)

router.get("/resetPassword", loginController.resetPassword)

router.put("/newPassword", loginController.newPassword)

router.get("/loggedInUser", loginController.loggedInUser)

router.put("/updateUser", loginController.updateUser)



export default router