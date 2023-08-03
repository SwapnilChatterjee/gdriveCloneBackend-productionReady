const User = require('../models/userModel');
const bcrypt = require('bcrypt');

module.exports.registerGETController = (req, res) => {
    res.status(200).json({ 'success': true, 'message': 'The register page is visited' });
}

module.exports.registerPOSTController = (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;

    if (!email || !username || !password) {
        res.status(400).json({ 'success': false, 'message': 'email/password/username is missing' });
    }
    else {
        bcrypt.hash(password, 10000, async (err, hash) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ 'success': false, 'message': 'server error hashing the password!' })
            }
            else {
                try {
                    const temp = new User({
                        username: username,
                        pass: hash,
                        email: email,
                        files: [],
                        admin: false,
                        refreshToken: []
                    })
                    User.insertMany([temp])
                        .then((result) => {
                            console.log("UPDATED IN PERSISTANT DB");
                        })
                        .catch((err) => {
                            console.log(err);
                        })
                    // console.log(response);
                    return res.status(201).json({ 'success': true, 'message': 'user registered successfully!' })
                } catch (err) {
                    console.log('err while registering: ', err);
                    return res.status(505).json({ 'success': false, 'message': 'server error registering user' })
                }
            }
        })
    }
}