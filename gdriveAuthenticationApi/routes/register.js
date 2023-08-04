const express = require('express');
const router = express.Router();
const { registerGETController , registerPOSTController} = require('../controller/registerController');

router
    .route("/")
    .get(registerGETController)
    .post(registerPOSTController)


module.exports = router;