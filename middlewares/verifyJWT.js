const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = (req,res,next)=>{
    const authHeader = req.headers['authorization'];
    if(!authHeader){res.status(401).json({ 'success':false, 'message':'Unauthorized' })}//no authentication header
    //the authHeader has Bearer <Access token>
    const accessToken = authHeader.split(' ')[1];
    jwt.verify(
        accessToken,
        process.env.AUTH_ACCESS_TOKEN_SECRET,
        (err,decoded) =>{
            if(err){res.sendStatus(403)}//invalid access token
            req.username = decoded.username;
            req.email = decoded.email;
            next();
        }
    )
}

module.exports = { verifyJWT };