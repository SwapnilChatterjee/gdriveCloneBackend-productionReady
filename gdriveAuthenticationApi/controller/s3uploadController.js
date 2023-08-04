const { Upload } = require('@aws-sdk/lib-storage')
const { s3 } = require('../config/aws_s3')


const axios = require('axios');





module.exports.uploadFileController = async (req, res) => {
    const file = req.file
    // params for s3 upload
    const params = {
        Bucket: "gdriveclonebucket",
        Key: file.originalname,
        Body: file.buffer,
        ACL: 'public-read', // Set ACL to public-read to make the uploaded file public
    }

    try {
        // upload file to s3 parallelly in chunks
        // it supports min 5MB of file size
        const uploadParallel = new Upload({
            client: s3,
            queueSize: 4, // optional concurrency configuration
            partSize: 5542880, // optional size of each part
            leavePartsOnError: false, // optional manually handle dropped parts
            params,
        })

        // checking progress of upload
        uploadParallel.on("httpUploadProgress", progress => {
            console.log(progress)
        })

        // after completion of upload
        uploadParallel.done().then(data => {
            //   console.log("upload completed!", data.Location)
            //   res.send(data)
            const hostedURL = data.Location;
            const postData = { url: hostedURL };
            const url = `${process.env.PARENT_URL}:${process.env.PORT}/upload/persistant`;

            axios.post(url, postData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then((response) => {
                    console.log('Response:', response.data);
                })
                .catch((error) => {
                    console.error('Error:', error.message);
                });
                res.send({
                    success: true,
                    message: hostedURL,
                })
        })
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        })
    }
}