import UserGoogle from "../models/userGoogleModel.js"
import {Strategy as googleStrategy} from "passport-google-oauth20"





const googleCredentials = (passport)=>{
    passport.use(new googleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "https://ernestruzindana-be.cyclic.app/google/callback"
    }, 
    
    (accessToken, refreshToken, profile, done)=>{
        // console.log(profile),
        UserGoogle.findOne({
            email: profile.emails[0].value
        })
        .then((data)=>{
            console.log(data)
            if (data){
                return done(null, data)
               
            }

            else {
                const newUserGoogle = new UserGoogle()

                newUserGoogle.userName = profile.displayName,
                newUserGoogle.email = profile.emails[0].value,
                newUserGoogle.githubId = profile.id,
                newUserGoogle.password = null,
                newUserGoogle.picture = profile.photos[0].value,
                newUserGoogle.provider = "google",
                newUserGoogle.isVerified = true

                newUserGoogle.save(function(error){
                    if (error) throw error;
                    return done(null, newUserGoogle)
                })
            }
        })
    }))

    
    passport.serializeUser(function (user, done) {
        // console.log(user)
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        UserGoogle.findById(id, function (err, user) {
            done(err, user);
        });
    });
}


export default googleCredentials