const mongoose = require('mongoose');

const userschema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Check the data entry not specified!!"]
    },
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
    }

    
    
})

const User = mongoose.model("User", userschema)

module.exports = User