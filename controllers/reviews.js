const Review=require("../models/review.js");
const Listing=require("../models/model1");

module.exports.addreview=async (req,res)=>{
 let listing = await Listing.findById(req.params.id);
 
 let newreview= new Review(req.body.review);

 newreview.author=req.user._id;
 
 listing.reviews.push(newreview);
 
    
  await newreview.save();
  await listing.save();

  req.flash("success","Review created!!");
 
  res.redirect(`/show/${listing._id}`);

};

module.exports.deletereview=async(req,res)=>{
    let {id,reviewid}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});
    await Review.findByIdAndDelete(reviewid);
    req.flash("success","Review deleted!!");
    res.redirect(`/show/${id}`);
};

