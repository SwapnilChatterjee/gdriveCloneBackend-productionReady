const User = require('../models/userModel');

module.exports.persistantdbController = async (req, res) => {
    const url = req.body.url;
    const client = await User.find({ username: "username" })
    // console.log(client);
    if (client.length != 0) {
        console.log("Found")
        User.updateOne({ username: "username" }, { "$push": { files: url } })
            .then((response)=>{
                console.log("UPdated");
            })
            .catch((err)=>{
                console.log(err);
            })
           
    }
    else {
        console.log("NOT")
        const temp = new User({
            name: "name1",
            username: "username",
            pass: "hash",
            files: [url],
            admin: false
        })
        User.insertMany([temp])
            .then((result)=>{
                console.log("UPDATED IN PERSISTANT DB");
            })
            .catch((err)=>{
                console.log(err);
            })
    }
    console.log(url);
}

