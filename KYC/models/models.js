
const  mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    username:{
         type:String,
        unique:true,
        lowercase:true,
        trim:true,
        required:true,
        minlength:[3]

    },
    email:{
        type:String,
        unique:true,
        lowercase:true,
        trim:true,
        required:true,
        minlength:[13]

    },
    password:{
        type:String,
        trim:true,
        minlength:[5],
        required:true,


    }
    

   

})

const user = mongoose.model('user',userSchema)

module.exports = user;