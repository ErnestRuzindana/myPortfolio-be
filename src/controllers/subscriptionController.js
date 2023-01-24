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

const replyMessage = async (request, response) => {
    try{
        const senderMessage = await contact.findOne({_id: request.params.id});

        senderMessage.replyMessage = request.body.replyMessage
        await senderMessage.save();

    // Email sender details
        const transporter = nodemailer.createTransport({
            service:"gmail",
            auth: {
                user: "elannodeveloper@gmail.com",
                pass: process.env.NODEMAILER_PASSWORD
            },
            tls: {
                rejectUnauthorized: false
            }
        })

        // Send verification email to user
        const mailOptions = {
            from: '"Ernest RUZINDANA" <elannodeveloper@gmail.com>',
            to: senderMessage.email,
            subject: "Ernest's portfolio reply message",
            html: `
            <div style="padding: 10px;">
                <h4> 
                ${senderMessage.replyMessage}
                </h4>
            </div>
            `
        }

        // Sending the email
        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                console.log(error)
            }

            else{
                console.log("Message sent!")
                 
            }
            response.status(200).json({
                "replyMessageSuccess": "Message sent!",
                "repliedMessage": senderMessage.replyMessage
            })
            console.log(senderMessage.replyMessage)
        })

    } 
    
    catch (error){
        console.log(error);
        response.status(500).json({
            "status": "fail",
            "message": error.message
        })
    }
}

export default {Subscribe, getAllSubscriptions, getSubscriberById, deleteSubscriber, verifyEmail};