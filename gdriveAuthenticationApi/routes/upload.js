var express = require('express');
var router = express.Router();
const upload = require('../config/multer')
const { uploadFileController } = require('../controller/s3uploadController')
const { persistantdbController } = require('../controller/dbuploadController')

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('upload');
// });

router
    .route("/")
    .get((req,res)=>{
        res.render("upload")
    })
    .post(upload.single("files"), uploadFileController);

router
    .route("/persistant")
    .post(persistantdbController);


module.exports = router;
