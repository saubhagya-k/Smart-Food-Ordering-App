const mongoose = require('mongoose');

function connecttoDb(){
    mongoose.connect(process.env.MONGO_URI).then(()=>{
        console.log("connected to DB")
    })
    .catch((error)=>{
        console.log("Error Occur:"+error)
    })
}
module.exports = connecttoDb;