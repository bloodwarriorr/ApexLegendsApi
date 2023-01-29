const DB = require("../Database/db");
const UserRouter = require("express").Router();
const passport = require('../node_modules/passport');
require('../Middleware/passportAuth')
UserRouter.get('/',(req,res)=>{
    res.send('<a href="/auth/google">Authenticate with Google</a>')
})
UserRouter.get('/auth/google',
passport.authenticate('google',{scope:['email','profile']}))


UserRouter.get('/google/callback', passport.authenticate('google',{
    successRedirect:'/api/docs',
    failureRedirect:'/auth/faliure'
}))

UserRouter.get('/auth/failure',(req,res)=>{
    res.send('something went wrong....')
})





module.exports = UserRouter;