 const mongoose = require('mongoose');
 mongoose.connect('mongodb://0.0.0.0:27017/minipro');


  const userschema = mongoose.Schema({
    username: String,
    name: String,
    age: Number,
    email:String,
    password:String,
    profile:{
      type: String,
      default: 'noDp.png',
    },
    post:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"post"
         }]
     })
    
    module.exports = mongoose.model('User',userschema)  //exporting the model
