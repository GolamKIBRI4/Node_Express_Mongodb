var express = require('express');
var router = express.Router();
const userModel=require('./users');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

passport.use( new localStrategy(userModel.authenticate())); // authenticate user using passport-local strategy

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});
//profile page
router.get("/profile",isLoggedIn, function(req,res){
  res.render("profile");
});


//register a new user
router.post('/register', function(req, res) {

  var userData =new userModel({
    username: req.body.username,
    secret: req.body.secret
  });
userModel.register(userData,req.body.password).then(function(registeredUser) {
    passport.authenticate('local')(req, res, function() {
       res.redirect('/profile');
    });
  });
});

//login a user
router.post("/login",passport.authenticate("local",{
  successRedirect: "/profile",
  failureRedirect: "/"
}),function(req,res){
  //this function is not used, but required by passport
});


//logout a user
router.get("/logout", function(req,res,next){
  req.logout(function(err) {
    if (err) { return next(err); }
  
    res.redirect('/');
  });
})



router.get("/create", async function(req,res){

  const newUser=await userModel.create({
    username: "Bot3",
    nickname: "Botguy3",
    description: "Life would be better with she here",
    categories: ['Hack','scam'],
    dateCreated: new Date() // current date and time
  });

  res.send(newUser);
});

//isLoggedIn
function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/");

}

 router.get("/finduser",async function(req,res){
  var regexp=new RegExp("^Golam Kibria$","i");
    let user = await userModel.find({username:regexp})
    res.send(user);
  });

  router.get("/oncategory",async function(req,res){
    let user = await userModel.find({categories:{$all:["Fashion","js"]}})
    if(user.length===0){
      return res.status(404).send("No user found with the specified categories");
    }
    
    res.send(user);
  });
 
  router.get("/ondaterange",async function(req,res){
    var startDate= new Date("2025-5-26");
    var endDate= new Date("2025-5-27");
    let user = await userModel.find({dateCreated:{$gte:startDate,$lte:endDate}});
    res.send(user)
  });

  router.get("/onexistance",async function(req,res){
    let user= await userModel.find({nickname:{$exists:false}})
    res.send(user);
  });

  router.get("/onspecificlength",async function(req,res){

  let user= await userModel.find({
    $expr:{
      $and:[
        {$gte: [{$strLenCP:{$ifNull:['$nickname',""] }},0]},
        {$lte: [{$strLenCP:{$ifNull:['$nickname',""] }},5]}
      ]
    }
  }

  )

  res.send(user);

  });

module.exports = router;
