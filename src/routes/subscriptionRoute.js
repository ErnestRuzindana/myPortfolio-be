import express from "express";
import subscriptionController from "../controllers/subscriptionController.js";

const router = express.Router();


router.post("/Subscribe", subscriptionController.Subscribe);

router.get("/getAllSubscriptions", subscriptionController.getAllSubscriptions);

router.delete("/deleteSubscriber/:id", subscriptionController.deleteSubscriber);

router.get("/verifyEmail", subscriptionController.verifyEmail)

router.get("/getSubscriberById/:id", subscriptionController.getSubscriberById);

router.post("/emailSubscribers", subscriptionController.emailSubscribers)

export default router;

