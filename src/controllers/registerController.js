import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import UserValidationSchema from "../validations/registerValidation.js";
import nodemailer from "nodemailer"
import crypto from "crypto"



const createNewUser = async(request, response) =>{

    const {error} = UserValidationSchema.validate(request.body)

    if (error)
        return response.status(400).json({"validationError": error.details[0].message})


    const duplicatedEmail = await User.findOne({email: request.body.email})

    if (duplicatedEmail)
        return response.status(409).json({"message": `The user with email "${request.body.email}" already exist`})

    try{
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


        const salt = await bcrypt.genSalt()

        const hashedPassword = await bcrypt.hash(request.body.password, salt)

        const hashedRepeatPassword = await bcrypt.hash(request.body.repeatPassword, salt)
        

        const newUser = new User({
            firstName: request.body.firstName,
            lastName: request.body.lastName,
            email: request.body.email,
            password: hashedPassword,
            repeatPassword: hashedRepeatPassword,
            emailToken: crypto.randomBytes(64).toString("hex"),
            isVerified: false
        })

        await newUser.save();

        const mailOptions = {
            from: '"Ernest RUZINDANA" <elannodeveloper@gmail.com>',
            to: newUser.email,
            subject: "Ernest's portfolio | Verify your email",
            html: `
            <div style="padding: 10px 0;">
                <h3> ${newUser.firstName} ${newUser.lastName} thank you for registering on my website! </h3> 
                <h4> Please verify your email to continue... </h4>
                <a style="border-radius: 5px; margin-bottom: 10px; text-decoration: none; color: white; padding: 10px; cursor: pointer; background: #cba10a;" 
                href="http://${request.headers.host}/register/verifyEmail?token=${newUser.emailToken}"> 
                Verify Email </a>
            </div>
            `
        }

        sender.sendMail(mailOptions, function(error, info){
            if(error){
                console.log(error)
            }

            else{
                console.log("Verification email sent to your account")
            }
        })

        response.status(201).json({"successMessage": "Account created successfully!"})
    }

    catch(error){
        console.log(error);
        response.status(500).json({
            "status": "fail",
            "errorMessage": error.message
        })
    }
}


const verifyEmail = async(request, response) =>{
    try{
        const token = request.query.token;
        const emailUser = await User.findOne({
            emailToken: token
        })

        if(emailUser){
            emailUser.emailToken = null;
            emailUser.isVerified = true;

            await emailUser.save()

            response.redirect(process.env.EMAILVERIFIED_REDIRECT_URL)
        }

        else{
            response.send("This email is already verified!")
        }
    }

    catch (error){
        console.log(error);
        response.status(500).json({
            "status": "fail",
            "message": error.message
        })
    }
}


const getAllUsers = async(request, response) =>{
    try{
        const RegisterUsers = await User.find()

        response.status(200).json({"RegisteredUsers": RegisterUsers})
    }

    catch (error){
        console.log(error);
        response.status(500).json({
            "status": "fail",
            "message": error.message
        })
    }
}

const getUserById = async (req, res) => {

    try{
        const user = await User.findOne({_id: req.params.id});
        if(user){
            res.status(200).json({ "fetchedUser": user });
        }

        else{
            res.status(400).json({
                "userFetchedError": "User not found",
            });
        }

    }

    catch (error){
        console.log(error);
        res.status(500).json({
            "status": "fail",
            "message": error.message
        })
    }

}

const assignUserRole = async(request, response) =>{
    try{
        const user = await User.findOne({_id: request.params.id});

        user.role = request.body.role

        await user.save();

        response.status(200).json({ "successMessage": `Role updated successfully!`, "role": user.role })
    }

    catch (error){
        console.log(error);
        response.status(500).json({
            "status": "fail",
            "message": error.message
        })
    }
}


const emailRegisteredUsers = async (request, response) => {
    try {

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

        const allUsers = await User.find();

        allUsers.forEach(user => {
           let firstName = user.firstName;
           let email =  user.email;
        
        const mailOptions = {
            from: '"Ernest RUZINDANA" <elannodeveloper@gmail.com>',
            to: email,
            subject: "Ernest RUZINDANA",
            html: `
            <!doctype html>
            <html lang="en" 
                xmlns="http://www.w3.org/1999/xhtml" 
                xmlns:v="urn:schemas-microsoft-com:vml" 
                xmlns:o="urn:schemas-microsoft-com:office:office">
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="x-apple-disable-message-reformatting">
                
                <title>Ernest Ruzindana</title>
                
                <!--[if gte mso 9]>
                <xml>
                <o:OfficeDocumentSettings>
                    <o:AllowPNG/>
                    <o:PixelsPerInch>96</o:PixelsPerInch>
                </o:OfficeDocumentSettings>
                </xml>
                <![endif]-->
                
            </head>
            <body style="margin:0; padding:0; background:#eeeeee;">
                
            
                <div style="display: none; font-size: 1px; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all; font-family: sans-serif;">
                    &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
                </div>
                
                <center>
                
                <div style="width:80%; background:#ffffff; padding:30px 20px; text-align:left; font-family: 'Arial', sans-serif;">
                
                <!--[if mso]>
                <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" bgcolor="#ffffff">
                <tr>
                <td align="left" valign="top" style="font-family: 'Arial', sans-serif; padding:20px;">
                <![endif]-->       
                    
                <a href='https://ernestruzindana.com/'><img src='https://www.linkpicture.com/q/Logo_125.png' width="100px" type='image'></a>
                
                <h1 style="font-size:16px; line-height:22px; font-weight:normal; color:#333333;">
                    Hello ${firstName},
                </h1>
                
                <p style="font-size:14px; line-height:24px; color:#666666; margin-bottom:30px;">
                    ${request.body.emailBody}   
                </p>
                
                
                
                <hr style="border:none; height:1px; color:#dddddd; background:#dddddd; width:100%; margin-bottom:20px;">
                
                <p style="font-size:12px; line-height:18px; color:#999999; margin-bottom:10px; text-align: center;">
                    &copy; Copyright 2023 
                    <a href="https://ernestruzindana.com/" 
                    style="font-size:12px; line-height:18px; color:#cba10a; text-decoration: none; font-weight:bold;">
                    Ernest Ruzindana</a>, All Rights Reserved.
                </p>
                
                <!--[if mso | IE]>
                </td>
                </tr>
                </table>
                <![endif]-->
                
                </div>
                
                </center>
                
            </body>
            </html>                                             
            `
        }


        sender.sendMail(mailOptions, function(error, info){
            if(error){
                console.log(error)
            }

            else{
                console.log("Email Sent successfully")
            }
        })

    })

        response.status(200).json({
            "successMessage": "Email sent successfully to all your subscribers!",
        })
      
    } catch (error) {
      console.log(error);
      response.status(500).json({
        "status": "fail",
        "errorMessage": error.message
      });
    }
  };

export default {createNewUser, getAllUsers, verifyEmail, assignUserRole, getUserById, emailRegisteredUsers}