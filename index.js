if(process.env.NODE_ENV !="production"){
require("dotenv").config();
}



const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");

const methodOverride = require('method-override');
const ejsMate =require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");

const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
const {isLoggedin} =require("./middleware.js");
const {saveRedirectUrl}=require("./middleware.js");
const {isOwner}=require("./middleware.js");
const {isAuthor}=require("./middleware.js");
const {listingSchema}=require("./schema.js");

const listingController=require("./controllers/listings.js");
const reviewController=require("./controllers/reviews.js");
const userController=require("./controllers/users.js");


const multer  = require('multer');
const {storage}=require("./cloudConfig.js");
const upload = multer({ storage: storage  });




app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.engine("ejs",ejsMate);

app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.json());


const dburl=process.env.MONGO_URL;



const store=MongoStore.create({
    mongoUrl:dburl,
    crypto: {
    secret: process.env.SECRET,
  },
    touchAfter:24*3600,
})

store.on("error",()=>{
    console.log("Error occur in storing session",err);
});

const sessionOptions={
    store,
    secret: process.env.SECRET,
     resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    },}

app.use(session(sessionOptions));
app.use(flash());



app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
     res.locals.error=req.flash("error");
     res.locals.curruser=req.user;
    next();
});




main().then(()=>
{
    console.log("successful connection with database");
}).catch((err)=>
{
console.log(err);
})


async function main()
{
     await mongoose.connect(dburl);
 }









//search route
app.get('/search',listingController.search);

//index route
app.get("/listing",wrapAsync(listingController.index));


//show
app.get("/show/:id",wrapAsync(listingController.showlisting));

 
//new Route
app.get("/listing/new",isLoggedin,listingController.rendernewform);



//Create Route
app.post("/listings",isLoggedin,upload.single('listing[image]'),wrapAsync(listingController.createlisting));




//edit Route
app.get("/listing/:id/edit",isOwner,isLoggedin,wrapAsync(listingController.edit));



//update Route
app.put("/listing/:id",isOwner,isLoggedin,upload.single('listing[image]'),wrapAsync(listingController.update));


//delete route
app.delete("/listing/:id",isOwner,isLoggedin,wrapAsync(listingController.delete));

//reviews

app.post("/listing/:id/reviews",isLoggedin,wrapAsync(reviewController.addreview));


//delete review route

app.delete("/listing/:id/reviews/:reviewid",isLoggedin,isAuthor,reviewController.deletereview);


//signup user

app.get("/signup",userController.signuprender);


//regiter user

app.post("/signup",userController.register);

//login route

app.get("/login",userController.loginrender);


app.post("/login",saveRedirectUrl,passport.authenticate("local",{
    failureRedirect:"/login",
    failureFlash:true,
}),userController.loginuser);



//logout

app.get("/logout",userController.logoutuser);




app.use((req,res,next)=>{
    return next(new ExpressError(404,"page not found!"));
});

app.use((err,req,res,next)=>{

   let {statusCode=500,message="Something went wrong"}=err;
   res.render("error.ejs",{message});
    // res.status(statusCode).send(message);

});



app.listen(8080,(req,res)=>
{
    console.log("working");
});






















