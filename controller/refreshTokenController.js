const User = require('../models/userModel');
const jwt = require("jsonwebtoken");
require('dotenv').config();


module.exports.refreshTokenController = (req, res) => {
    const cookies = req.cookies;
    console.log(cookies);
    // console.log("USERNAME "+username)
    if (!cookies || !(cookies.jwt)) {console.log("hihihi"); res.sendStatus(401); return; }//no refreshtoken found

    const refreshToken = cookies.jwt;
    // console.log("OLD REFRESH TOKEN IS"+ refreshToken);
    res.clearCookie('jwt', { httpOnly: true });

    User.find({ refreshToken: Buffer.from(refreshToken) })
        .then((response) => {
            //Detected old refresh token reuse
            if (response.length == 0) {
                // console.log(response.length)
                jwt.verify(
                    refreshToken,
                    process.env.AUTH_REFRESH_TOKEN_SECRET,
                    (err, decoded) => {
                        if (err) {
                            res.sendStatus(403)//Fake refresh token detected
                        }
                        //valid token means it is a old refresh token for the user hence the user has been hacked so clearing all of its refresh tokens
                        // console.log(decoded.email);
                        User.updateOne({ username: decoded.username }, { refreshToken: [] })
                            .then((response) => {
                                console.log("Cleared all tokens and loggedout of all the devices");
                            })
                            .catch((err) => {
                                console.log(err);
                            })

                    }
                )
                res.status(403).json({ 'success': false, 'message': 'User not found' });//forbidden
                return;

            }
            else {
                jwt.verify(
                    refreshToken,
                    process.env.AUTH_REFRESH_TOKEN_SECRET,
                    (err, decoded) => {
                        if (err) {
                            //invalid refresh token but found in DB to removing it from db
                            User.updateOne({ username: response[0].username }, { "$pull": { refreshToken: Buffer.from(refreshToken) } })
                                .then((response) => {
                                    console.log("CLEARED REFREHS TOKEN IN DB");
                                    console.log("Expired Refresh token detected");
                                    res.sendStatus(401);
                                    return;
                                })
                                .catch((err) => {
                                    console.log(err);
                                    
                                })

                        }
                        else if (err || response[0].username != decoded.username) { res.sendStatus(403); return; }
                        else {
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
                            const newrefreshtoken = jwt.sign(
                                {
                                    "username": response[0].username,
                                    "email": response[0].email
                                },
                                process.env.AUTH_REFRESH_TOKEN_SECRET,
                                {
                                    expiresIn: "60s"
                                }

                            );
                            //removing old refresh token from db and adding the ne refresh token
                            User.updateOne({ username: decoded.username }, { "$pull": { refreshToken: Buffer.from(refreshToken) } })
                                .then((response) => {
                                    console.log("CLEARED REFREHSHTOKEN IN DB");
                                    //saving new refresh token in persistant DB
                                    User.updateOne({ username: decoded.username }, { "$push": { refreshToken: Buffer.from(newrefreshtoken) } })
                                        .then((response) => {
                                            console.log("UPDATED NEW REFRESH TOKEN IN DB");
                                            //storing the refresh token in the http only cookie in frontend which cannot be accessed by javascript hence safe
                                            res.cookie('jwt', newrefreshtoken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
                                            //sending the accesstoken via json to frontend
                                            res.status(200).json({ 'accessToken': accesstoken });
                                        })
                                        .catch((err) => {
                                            console.log(err);
                                            res.sendStatus(403);
                                        })
                                })
                                .catch((err) => {
                                    console.log(err);
                                    res.sendStatus(403);
                                })

                            

                        }
                    }
                )

            }

        })
}