const User=require("../models/user.js");


module.exports.signuprender=(req,res)=>{
   // res.send("signup working");
    res.render("users/signup.ejs");
};

module.exports.register=async (req,res)=>{
    try{
let {username,email,password}=req.body;
  const newUser=new User({email,username});
  const  registeredUser=  await User.register(newUser,password);
   console.log(registeredUser);

     req.login (registeredUser,(err)=>{
        if(err){
            next(err);
        }
        req.flash("success","Welcome to Wandurlust");
        return res.redirect("/listing");
    });
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
};

module.exports.loginrender=(req,res)=>{
    res.render("users/login.ejs");
};

module.exports.loginuser=async (req,res)=>{
    req.flash("success","Welcome back to Wandurlust!!");
   const redirectUrl = res.locals.redirectUrl || "/listing"; // fallback route
    delete req.session.redirectUrl; // cleanup session
    res.redirect(redirectUrl);
};

module.exports.logoutuser=(req,res)=>{
    req.logout ((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","You are logged out");
        return res.redirect("/listing");
    });
};