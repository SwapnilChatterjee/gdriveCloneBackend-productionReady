const express = require('express');
const router = express.Router();
const { verifyJWT } = require('../middlewares/verifyJWT')

router
    .route("/")
    .get(verifyJWT, (req,res)=>{
        res.status(200).json({ 'message':'User logged in successfully' });
    })


module.exports = router;