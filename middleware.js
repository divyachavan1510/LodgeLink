const Listing=require("./models/model1.js")
const Review=require("./models/review.js")
module.exports.isLoggedin=(req,res,next)=>{

     if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must be logged in to do that!!");
       return res.redirect("/login");
    }
   next();
};

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
      res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner=async (req,res,next)=>{
   
   
    let {id}=req.params;  
    let listing=await Listing.findById(id);

    if (!res.locals.curruser) {
        req.flash("error", "You must be signed in to do that");
        return res.redirect(`/login`);
    }

    if(!listing.owner.equals(res.locals.curruser._id)){
        req.flash("error","You are not owner of this listing");
       
        return res.redirect(`/show/${id}`);
     
    }

    next();
};

module.exports.isAuthor=async (req,res,next)=>{
   
    let {id}=req.params;
    let {reviewid}=req.params;  
    let review=await Review.findById(reviewid);

    if (!res.locals.curruser) {
        req.flash("error", "You must be signed in to do that");
        return res.redirect(`/login`);
    }


    if(!review.author.equals(res.locals.curruser._id)){
        req.flash("error","You are not author of this listing");
       
        return res.redirect(`/show/${id}`);
     
    }

    next();
};


