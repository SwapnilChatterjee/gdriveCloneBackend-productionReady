const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const dbConnect = () =>{
    // console.log("Trying")
    mongoose.connect(process.env.DB_URL)
    .then(()=>{
            console.log(`CONNECTED TO PERSISTANT DATABASE AND LISTENING TO PORT  ${process.env.PORT}`)
    })
    .catch((err)=>{
        console.log(err)
    })
}

module.exports = dbConnect;