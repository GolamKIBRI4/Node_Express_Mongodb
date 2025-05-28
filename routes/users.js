
const mongoose= require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
mongoose.connect('mongodb://localhost:27017/testingendgame2')
const userSchema=mongoose.Schema({
  username:String,
  nickname:String,
  description:String,
 
  categories:{
    type:Array,
    default: []
    
  },
  dateCreated:{
    type:Date,
    default: Date.now
  }


})
userSchema.plugin(passportLocalMongoose);

module.exports= mongoose.model('user',userSchema);