  const mongoose = require('mongoose');
   
    const postschema = mongoose.Schema({
     user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
          },

     likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
          }],

     content: String,

     date: {
        type: Date,
        default: Date.now
     }
     
 })
     
    module.exports = mongoose.model('post',postschema)  //exporting the model
 