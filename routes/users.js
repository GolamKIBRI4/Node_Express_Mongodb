const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

mongoose.connect('mongodb+srv://golamkibria:1234@cluster0.dd3t8ro.mongodb.net/allusers?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
  });

const userSchema=mongoose.Schema({
  username:String,
  password:String,
  secret:String,


})
userSchema.plugin(plm);

module.exports= mongoose.model('user',userSchema);
