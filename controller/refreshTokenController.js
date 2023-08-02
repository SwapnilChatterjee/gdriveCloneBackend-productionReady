const User = require('../models/userModel');
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');


module.exports.refreshTokenController = (req, res) => {
    const cookies = req.cookies;
    // console.log("USERNAME "+username)
    if (!cookies?.jwt) { res.sendStatus(401) }//no refreshtoken found

    const refreshToken = cookies.jwt;

    User.find({ refreshToken: Buffer.from(refreshToken) })
        .then((response) => {
            if (!response) {
                res.status(403).json({ 'success': false, 'message': 'User not found' });//forbidden
            }
            else {
                jwt.verify(
                    refreshToken,
                    process.env.AUTH_REFRESH_TOKEN_SECRET,
                    (err, decoded) => {
                        if (err || response[0].username != decoded.username) { res.sendStatus(403) }
                        //create JWT
                        const accesstoken = jwt.sign(
                            {
                                "username": decoded.username,
                                "email": decoded.email
                            },
                            process.env.AUTH_ACCESS_TOKEN_SECRET,
                            {
                                expiresIn: "30s"
                            }

                        );
                        res.status(200).json({ 'accessToken': accesstoken });

                    }
                )
                
            }

        })
}