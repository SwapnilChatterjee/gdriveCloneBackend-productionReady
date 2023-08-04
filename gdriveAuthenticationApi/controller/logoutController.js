const User = require('../models/userModel');

module.exports.logoutController = (req, res) => {
    //TODO is on client side delete the access token also
    const cookies = req.cookies;
    // console.log("USERNAME "+username)
    if (!cookies?.jwt) { res.sendStatus(204) }//no content to sent back and req is successfull
    const refreshToken = cookies.jwt;
    //is refreshotoken in DB
    User.find({ refreshToken: Buffer.from(refreshToken) })
        .then((response) => {
            if (response.length == 0) {
                res.clearCookie('jwt', { httpOnly: true });
                res.status(204).json({ 'success': true, 'message': 'Cookie Cleared' });//forbidden
            }
            else {
                //Delete refreshToken in db
                User.updateOne({username:response[0].username},{ "$pull": { refreshToken: Buffer.from(refreshToken) } })
                        .then((response)=>{
                            console.log("CLEARED IN DB");
                            res.clearCookie('jwt', { httpOnly: true });
                            res.sendStatus(204);
                        })
                        .catch((err)=>{
                            console.log(err);
                        })
                
            }

        })
}