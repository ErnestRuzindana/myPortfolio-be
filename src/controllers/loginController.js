import User from "../models/userModel.js"
import bcrypt from "bcrypt"
import Jwt from "jsonwebtoken"
import nodemailer from "nodemailer"
import forgotPasswordValidationSchema from "../validations/forgotPasswordValidation.js"
import resetPasswordValidationSchema from "../validations/resetPasswordValidation.js"
import cloudinary from "../helpers/cloudinary.js";



const loginUser = async(request, response) =>{
    try{
        const userEmail = await User.findOne({email: request.body.email})

        if (!userEmail) 
            return response.status(400).json({
                "invalidEmail": "Invalid email or password, Please try again"
            })

        if(!userEmail.isVerified)
            return response.status(400).json({
                "invalidEmail": "Please check your email to verify this account!"
            })

        
        const userPassword = await bcrypt.compare(request.body.password, userEmail.password)

        if (!userPassword)
            return response.status(400).json({
                "invalidPassword": "Invalid email or password, Please try again"
            })

        
        const token = Jwt.sign({ data : userEmail } , process.env.ACCESS_TOKEN_SECRET)
        response.header("auth_token", token)

        const userRole = userEmail.role;
        response.set("token", token).json({
            "successMessage": "Logged In Successfully!", 
            "Access_Token": token, 
            "role": userRole
        })
    }

    catch(error){
        console.log(error.message)
        response.status(500).json({
            "status": "Fail",
            "errorMessage": error.message
        })
    }
}


const loggedInUser = async(request, response) =>{
    try{

        const loggedInUser = await User.findOne({ _id : request.user._id })

        response.status(200).json({
            "successMessage": "LoggedIn User Fetched Successfully!",
            "loggedInUser": loggedInUser, 
        })
    }

    catch(error){
        console.log(error)
        response.status(500).json({
            "status": "fail",
            "errorMessage": error.message
        })
    }
}



// forgot password

const forgotPassword = async(request, response) =>{
    try{
        const {error} = forgotPasswordValidationSchema.validate(request.body)

        if (error)
            return response.status(400).json({"validationError": error.details[0].message})


        const userEmailResetPassword = await User.findOne({email: request.body.email})

        if (!userEmailResetPassword) 
            return response.status(400).json({
                "invalidEmail": `${request.body.email} is not registered`
            })

        if(!userEmailResetPassword.isVerified)
            return response.status(400).json({
                "unverifiedEmail": "This email is not verified!"
            })

        

        const resetPasswordToken = Jwt.sign({userEmailResetPassword}, process.env.FORGOTPASSWORD_RESET_SECRET)
            response.header("auth_token", resetPasswordToken)

            await userEmailResetPassword.updateOne({
                resetToken: resetPasswordToken
            })

        const sender = nodemailer.createTransport({
            service:"gmail",
            auth: {
                user: "elannodeveloper@gmail.com",
                pass: process.env.NODEMAILER_PASSWORD
            },
            tls: {
                rejectUnauthorized: false
            }
        })


        const mailOptions = {
            from: '"Ernest RUZINDANA" <elannodeveloper@gmail.com>',
            to: userEmailResetPassword.email,
            subject: "Ernest's portfolio reset password",
            html: `
            <div style="padding: 10px;">
                <h3> ${userEmailResetPassword.firstName} ${userEmailResetPassword.lastName} I can see you forgot your password! </h3> 
                <h4> Click the button below to reset your password... </h4>
                <a style="border-radius: 5px; margin-bottom: 10px; text-decoration: none; color: white; padding: 10px; cursor: pointer; background: #cba10a;" 
                href="http://${request.headers.host}/login/resetPassword?resetToken=${resetPasswordToken}"> 
                Reset password </a>
            </div>
            `
        }


        sender.sendMail(mailOptions, function(error, info){
            if(error){
                console.log(error)
            }

            else{
                console.log("Please check your account to reset your password")

                response.status(200).json({
                    "resetSuccess": "Please check your account to reset your password",
                    "forgotPasswordResetToken": resetPasswordToken
                })
            }
        })



                
    }
    

    catch(error){
        console.log(error)
        response.status(500).json({
            "status": "fail",
            "errorMessage": error.message
        })
    }
}



// Resetting the password

const resetPassword = async(request, response) =>{
    try{
      const token = request.query.resetToken
        console.log(token)

      const checkToken = await User.findOne({resetToken: token})
      console.log(checkToken)

      if (checkToken){
        checkToken.resetToken = null

        await checkToken.save()
        response.redirect(process.env.RESETPASSWORD_REDIRECT_URL)
      }

      else{
        response.send("You can't use this reset password link twice! If you wish to reset your password again, consider repeating the request!")
      }

    }

    catch(error){
        console.log(error)
        response.status(500).json({
            "status": "fail",
            "errorMessage": error.message
        })
    }
}



// Creating a new password

const newPassword = async(request, response) =>{
    try{

        const {error} = resetPasswordValidationSchema.validate(request.body)

        if (error)
            return response.status(400).json({"validationError": error.details[0].message})


        const token = request.header("auth_token")

        if(!token)
        return response.status(401).json({
            "message": "Please login!"
        })

        Jwt.verify(token, process.env.FORGOTPASSWORD_RESET_SECRET, async (err, decodedToken)=>{
            if(err){
                console.log(err.message)
            }


            else{
                console.log(decodedToken)
                const userNewPassword = await User.findById(decodedToken.userEmailResetPassword._id)

                

                const newSalt = await bcrypt.genSalt()
                const newHashedPassword = await bcrypt.hash(request.body.password, newSalt)
                const newHashedRepeatPassword = await bcrypt.hash(request.body.repeatPassword, newSalt)

                await userNewPassword.updateOne({
                    password: newHashedPassword,
                    repeatPassword: newHashedRepeatPassword
                })

                response.status(200).json({"newPasswordSuccess": "Password is reseted successfully!"})
            }
         })
    }


    catch(error){
        console.log(error)
        response.status(500).json({
            "status": "fail",
            "errorMessage": error.message
        })
    }
}



// update user profile

const updateUser = async(request, response) =>{


    try{
        

                const ourLoggedInUser = await User.findById(request.user._id) 

                if (ourLoggedInUser){

                    if (request.body.imageLink){
                        const result = await cloudinary.uploader.upload(request.body.imageLink, {
                            folder: "Ernest's User Images"
                        })

                        ourLoggedInUser.firstName = request.body.firstName || ourLoggedInUser.firstName,
                        ourLoggedInUser.lastName = request.body.lastName || ourLoggedInUser.lastName,
                        ourLoggedInUser.bio = request.body.bio || ourLoggedInUser.bio,
                        ourLoggedInUser.profileFacebook = request.body.profileFacebook || ourLoggedInUser.profileFacebook,
                        ourLoggedInUser.profileTwitter = request.body.profileTwitter || ourLoggedInUser.profileTwitter,
                        ourLoggedInUser.profileLinkedin = request.body.profileLinkedin || ourLoggedInUser.profileLinkedin,
                        ourLoggedInUser.profileInstagram = request.body.profileInstagram || ourLoggedInUser.profileInstagram
                        ourLoggedInUser.imageLink = result.secure_url || ourLoggedInUser.imageLink
                    }

                    else{
                        ourLoggedInUser.firstName = request.body.firstName || ourLoggedInUser.firstName,
                        ourLoggedInUser.lastName = request.body.lastName || ourLoggedInUser.lastName,
                        ourLoggedInUser.bio = request.body.bio || ourLoggedInUser.bio,
                        ourLoggedInUser.profileFacebook = request.body.profileFacebook || ourLoggedInUser.profileFacebook,
                        ourLoggedInUser.profileTwitter = request.body.profileTwitter || ourLoggedInUser.profileTwitter,
                        ourLoggedInUser.profileLinkedin = request.body.profileLinkedin || ourLoggedInUser.profileLinkedin,
                        ourLoggedInUser.profileInstagram = request.body.profileInstagram || ourLoggedInUser.profileInstagram                       
                    }
                        
                    
                    
                    await ourLoggedInUser.save()

                   

                    if(request.body.profileFacebook == ""){
                        ourLoggedInUser.profileFacebook = undefined;
                        delete ourLoggedInUser.profileFacebook;
                        await ourLoggedInUser.save()
                    }

                    if(request.body.profileTwitter == ""){
                        ourLoggedInUser.profileTwitter = undefined;
                        delete ourLoggedInUser.profileTwitter;
                        await ourLoggedInUser.save()
                    }

                    if(request.body.profileInstagram == ""){
                        ourLoggedInUser.profileInstagram = undefined;
                        delete ourLoggedInUser.profileInstagram;
                        await ourLoggedInUser.save()
                    }

                    if(request.body.profileLinkedin == ""){
                        ourLoggedInUser.profileLinkedin = undefined;
                        delete ourLoggedInUser.profileLinkedin;
                        await ourLoggedInUser.save()
                    }

                    if(request.body.bio == ""){
                        ourLoggedInUser.bio = undefined;
                        delete ourLoggedInUser.bio;
                        await ourLoggedInUser.save()
                    }

                    response.status(200).json({
                        "successMessage": "Profile updated successfully!",
                        "ourUpdatedUser": ourLoggedInUser
                    })
                }

                else{
                    response.status(404).json({"message": "User not found!"})
                }

    }

    catch(error){
        console.log(error)
        response.status(500).json({
            "status": "fail",
            "errorMessage": error.message
        })
    }
}


export default {loginUser, loggedInUser, updateUser, forgotPassword, resetPassword, newPassword}