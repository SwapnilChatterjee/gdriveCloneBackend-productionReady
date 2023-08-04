const multer = require('multer')
//initializing storage for multer file upload
// const storage = multer.diskStorage({
//     destination: (req, file, callback) => {
//         callback(null, 'uploads')
//     },
//     filename: (req, file, callback) => {
//         // UID = shortid.generate()
//         // let a = UID.toString()
//         callback(null, file.originalname)
//     }

// })
//defining the upload middleware to upload
const upload = multer()

module.exports = upload;