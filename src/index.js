
import bodyParser from "body-parser";
import express from "express";
const app = express();

import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv"
import contactRoute from "./routes/contactRoute.js";
import registerRoute from "./routes/registerRoute.js";
import googleRoute from "./routes/googleRoute.js";
import facebookRoute from "./routes/facebookRoute.js";
import githubRoute from "./routes/githubRoute.js";
import loginRoute from "./routes/loginRoute.js";
import passport from "passport";
import expressSession from "express-session";
import MemoryStore from "memorystore";
import cookieParser from "cookie-parser";
import socialMediaLoggedInUser from "./routes/socialMediaRoute.js";
import blogRoute from "./routes/blogRoute.js";
import subscriptionRoute from "./routes/subscriptionRoute.js";



dotenv.config()
const ourMemoryStore = MemoryStore(expressSession);

const corsOptions = {
    origin: '*',
    credentials:true,
    optionsSuccessStatus: 200 
  }

 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.bodyParser({limit: '50mb'}));

app.use(express.json({limit: "50mb", extended: true}))
app.use(express.urlencoded({limit: "50mb", extended: true, parameterLimit: 50000}))

// app.use(express.urlencoded({ extended: true }));

app.use(cookieParser('random'));

app.use(expressSession({
    secret: "random",
    resave: true,
    saveUninitialized: true,
    // setting the max age to longer duration
    maxAge: 24 * 60 * 60 * 1000,
    store: new ourMemoryStore(),
}));

app.use(passport.initialize());
app.use(passport.session());



app.use("/contact", cors(corsOptions), contactRoute);
app.use("/register", cors(corsOptions), registerRoute);
app.use("/login", cors(corsOptions), loginRoute);
app.use("/", cors(corsOptions), googleRoute);
app.use("/", cors(corsOptions), facebookRoute);
app.use("/", cors(corsOptions), githubRoute);
app.use("/", cors(corsOptions), socialMediaLoggedInUser);
app.use("/", cors(corsOptions), blogRoute);
app.use("/", cors(corsOptions), subscriptionRoute);

app.use('/images',express.static('src/images'));
app.use('/postImages',express.static('src/postImages'));





mongoose.connect(process.env.DB_CONNECT,{useNewUrlParser: true});

mongoose.connection.once("open", ()=>{
    console.log("connected to Mongo DB");
})


const port = process.env.PORT_NUMBER || 5300;
app.listen(port, ()=>{
    console.log(`The server is running on ${port}`);
})


