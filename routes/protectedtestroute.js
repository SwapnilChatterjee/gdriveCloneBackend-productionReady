const express = require('express');
const router = express.Router();
const { verifyJWT } = require('../middlewares/verifyJWT')

router
    .route("/")
    .get(verifyJWT, (req,res)=>{
        res.json({ 'message':'User logged in successfully' });
    })


module.exports = router;