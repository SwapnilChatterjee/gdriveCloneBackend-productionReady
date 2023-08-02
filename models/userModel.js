const mongoose = require('mongoose');

const userschema = new mongoose.Schema({
    username : {
        type: String,
        required: [true, "Please Check the data entry not specified!!"],
        
    },
    pass:{
        type: String,
        required: [true, "PASSWORD MISSING--------"]
    },
    files:[{
        type: String,

    }],
    admin: {
        type: Boolean
    },
    refreshToken: {
        type: String,
    }

    
    
})

const User = mongoose.model("User", userschema)

module.exports = User