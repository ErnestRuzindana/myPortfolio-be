import subscription from "../models/subscriptionModel.js";
import subscriptionValidationSchema from "../validations/subscriptionValidation.js";
import nodemailer from "nodemailer"
import crypto from "crypto"

const Subscribe = async(request, response) =>{

    // input validation
    const {error} = subscriptionValidationSchema.validate(request.body);

    if (error)
        return response.status(400).json({"validationError": error.details[0].message})

    try{

        const duplicatedEmail = await subscription.findOne({subscriberEmail: request.body.subscriberEmail})

        if (duplicatedEmail)
            return response.status(409).json({"duplicateError": `This email already belongs to our subscriber!`})

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

        const subscribedMessage = await subscription.create({
            subscriberEmail: request.body.subscriberEmail,
            emailToken: crypto.randomBytes(64).toString("hex")
        })

        const Subscriber = await subscription.findOne({subscriberEmail: request.body.subscriberEmail})

        const mailOptions = {
            from: '"Ernest RUZINDANA" <elannodeveloper@gmail.com>',
            to: Subscriber.subscriberEmail,
            subject: "Ernest's portfolio verify your email",
            html: `
            <div style="padding: 10px 0px;">
                <h3> Thank you for subscribing on my website! </h3> 
                <h4> Click the button below to verify your email... </h4>
                <a style="border-radius: 5px; margin-bottom: 10px; text-decoration: none; color: white; padding: 10px; cursor: pointer; background: #cba10a;" 
                href="http://${request.headers.host}/verifyEmail?token=${Subscriber.emailToken}"> 
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
    
        response.status(201).json({
            "successMessage": "Subscribed successfully, to confirm this email address go your email to verify your account!",
            "subscribedMessage": subscribedMessage
        })

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
        const Subscriber = await subscription.findOne({
            emailToken: token
        })

        if(Subscriber){
            Subscriber.emailToken = null;
            Subscriber.isVerified = true;

            await Subscriber.save()

            response.redirect(process.env.SUBSCRIPTION_EMAILVERIFIED_REDIRECT_URL)
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


const getAllSubscriptions = async(request, response) =>{
    try{
        const subscribers = await subscription.find()
        .sort({createdAt: -1});

        response.status(200).json({
            "status": "Successfully retrieved all subscribers!",
            "subscribers": subscribers
        })
    }

    catch(error){
        console.log(error);
        response.status(500).json({
            "status": "fail", 
            "message": error.message
        })
    }
}

const getSubscriberById = async(request, response) =>{
    try{
        const subscriber = await subscription.findOne({_id: request.params.id});

        response.status(200).json({
            "clientMessageSuccess": "Successfully retrieved the subscriber!",
            "subscriberMessage": subscriber
        })
    }

    catch(error){
        console.log(error);
        response.status(500).json({
            "status": "fail", 
            "message": error.message
        })
    }
}



const deleteSubscriber = async(request, response) =>{
    try{
        const subscriber = await subscription.findOne({_id: request.params.id});

        await subscriber.deleteOne({_id: request.params.id});

        response.status(200).json({
            "status": "success",
            "removedMessage": "Subscriber removed successfully!"
        })
    }

    catch(error){
        console.log(error);
        response.status(500).json({
            "status": "fail", 
            "message": error.message
        })
    }
}

const emailSubscribers = async (request, response) => {
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

        const allSubscribers = await subscription.find();
        let emails = allSubscribers.map(subscriber => subscriber.subscriberEmail);
        
        const mailOptions = {
            from: '"Ernest RUZINDANA" <elannodeveloper@gmail.com>',
            to: emails,
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
                    Hello,
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


export default {Subscribe, getAllSubscriptions, getSubscriberById, deleteSubscriber, verifyEmail, emailSubscribers};