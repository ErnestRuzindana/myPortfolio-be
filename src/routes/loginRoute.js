import express from "express"
import loginController from "../controllers/loginController.js"
import authentication from "../middlewares/authentication.js"


const router = express.Router()

router.post("/loginUser", loginController.loginUser)

router.post("/forgotPassword", loginController.forgotPassword)

router.get("/resetPassword", loginController.resetPassword)

router.put("/newPassword", loginController.newPassword)

router.get("/loggedInUser", authentication.authLogin, loginController.loggedInUser)

router.put("/updateUser", authentication.authLogin, loginController.updateUser)



export default router