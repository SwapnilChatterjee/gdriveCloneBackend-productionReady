const User = require('../models/userModel');
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');

dotenv.config();

module.exports.loginGETController = (req,res)=>{
    res.status(200).json({ 'success':true, 'message':'Login Page Visited' });
}

module.exports.loginPOSTController = (req,res)=>{
    const username =  req.body.username;
    const password = req.body.password;
    // console.log("USERNAME "+username)
    User.find({username: username})
        .then((response)=>{
            if(!response){
                res.status(401).json({ 'success':false, 'message':'User not found' });
            }
            else{
                const hash = response[0].pass.toString();
                const result =  bcrypt.compare(password,hash);
                if(result){
                    //create JWT
                    const accesstoken = jwt.sign(
                        {
                            "username":response[0].username,
                            "email":response[0].email
                        },
                        process.env.AUTH_ACCESS_TOKEN_SECRET,
                        {
                            expiresIn:"30s"
                        }

                    );

                    const refreshtoken = jwt.sign(
                        {
                            "username":response[0].username,
                            "email":response[0].email
                        },
                        process.env.AUTH_REFRESH_TOKEN_SECRET,
                        {
                            expiresIn:"1d"
                        }

                    );
                    //saving refresh token in persistant DB
                    User.updateOne({username:response[0].username},{ "$push": { refreshToken: Buffer.from(refreshtoken) } })
                        .then((response)=>{
                            console.log("UPDATED IN DB");
                            //storing the refresh token in the http only cookie in frontend which cannot be accessed by javascript hence safe
                            res.cookie('jwt', refreshtoken, { httpOnly: true, maxAge: 24*60*60*1000 });
                            //sending the accesstoken via json to frontend
                            res.status(200).json({ 'accessToken':accesstoken });
                        })
                        .catch((err)=>{
                            console.log(err);
                        })


                    
                }
                else{
                    res.status(401).json({ 'success':false, 'message':'Unauthorized' })
                }
            }
                
        })
}
