import UserFacebook from "../models/userFacebookModel.js"
import {Strategy as facebookStrategy} from "passport-facebook"





const facebookCredentials = (passport)=>{
    passport.use(new facebookStrategy({
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: "https://ernestruzindana-be.cyclic.app/facebook/callback",
        profileFields: ["id", "displayName", "email", "name", "picture"]
    }, 
    
    (accessToken, refreshToken, profile, done)=>{
        console.log(profile),
        UserFacebook.findOne({
            facebookId: profile.id
        })
        .then((data)=>{
            if (data){
                return done(null, data)
            }

            else {
                const newFacebookUser = new UserFacebook()

                newFacebookUser.userName = profile.displayName,
                newFacebookUser.email = profile.emails[0].value,
                newFacebookUser.githubId = profile.id,
                newFacebookUser.password = null,
                newFacebookUser.picture = profile.photos[0].value,
                newFacebookUser.provider = "facebook",
                newFacebookUser.isVerified = true

                newFacebookUser.save(function(error){
                    if (error) throw error;
                    return done(null, newFacebookUser)
                })
            }
        })
    }))

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        UserFacebook.findById(id, function (err, user) {
            done(err, user);
        });
    });
}


export default facebookCredentials