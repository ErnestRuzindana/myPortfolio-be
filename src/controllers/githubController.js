import UserGithub from "../models/userGithubModel.js"
import {Strategy as githubStrategy} from "passport-github"





const githubCredentials = (passport)=>{
    passport.use(new githubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "https://ernestruzindana-be.cyclic.app/github/callback"
    }, 
    
    (accessToken, refreshToken, profile, done)=>{
        console.log(profile),
        UserGithub.findOne({
            githubId: profile.id
        })
        .then((data)=>{
            if (data){
                return done(null, data)
            }

            else {
                const newGithubUser = new UserGithub()

                newGithubUser.userName = profile.displayName,
                newGithubUser.email = profile.username,
                newGithubUser.githubId = profile.id,
                newGithubUser.password = null,
                newGithubUser.picture = profile.photos[0].value,
                newGithubUser.provider = "github",
                newGithubUser.isVerified = true

                newGithubUser.save(function(error){
                    if (error) throw error;
                    return done(null, newGithubUser)
                })
            } 
        })
    }))

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        UserGithub.findById(id, function (err, user) {
            done(err, user);
        });
    });
}


export default githubCredentials