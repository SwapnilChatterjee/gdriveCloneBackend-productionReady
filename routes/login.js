const express = require('express');
const router = express.Router();
const { loginGETController , loginPOSTController} = require('../controller/loginController');

router
    .route("/")
    .get(loginGETController)
    .post(loginPOSTController)


module.exports = router;