const listing=require("../models/model1");
const Listing = require("../models/model1.js");
const {listingSchema}=require("../schema.js");
const ExpressError=require("../utils/ExpressError.js");


const multer  = require('multer');




// module.exports.index=async (req,res)=>
// {
//     const listings=await listing.find({});
//     res.render("listings/index.ejs",{listings});

// };

module.exports.index = async (req, res) => {
  const listings = await listing.find({});

  // Ensure every listing has a fallback image
  const listingsWithImages = listings.map(l => {
    if (!l.image || !l.image.url) {
      l.image = {
        url: "https://via.placeholder.com/300x200?text=No+Image",
        filename: "default-placeholder"
      };
    }
    return l;
  });

  res.render("listings/index.ejs", { listings: listingsWithImages });
};




module.exports.showlisting=async (req,res)=>
{
    const {id}=req.params;
    const list=await listing.findById(id)
    .populate({
        path:"reviews",
        populate:{
            path:"author",
        },
    }).populate("owner");
    if(!list){
        
        req.flash("error","Listing does not exits!!");
       return res.redirect("/listing");
    }
    res.render("listings/show.ejs",{list});
};

module.exports.rendernewform=(req,res)=>
{

    res.render("listings/new.ejs");
};

module.exports.createlisting=async (req,res,next)=>
   { 


  let result=listingSchema.validate(req.body);
  console.log(result);
   if(result.error){
      throw new ExpressError(400,result.error);
   }


    const newlistings=new Listing(req.body.listing);

      if (req.file) {
    newlistings.image = {
      url: req.file.path,         // Cloudinary URL
      filename: req.file.filename, // Cloudinary file ID
    };

    console.log(newlistings.image);
  }
  


    newlistings.owner=req.user._id;
   await newlistings.save();
   req.flash("success","New Listing Created!!");
   res.redirect("/listing");
   };

 module.exports.edit=async (req,res)=>
   { 
       let {id}=req.params;
       let list=await listing.findById(id);
        if(!list){
           
           req.flash("error","Listing does not exits!!");
            return res.redirect("/listing");
       }
       let originalimg=list.image.url;
       originalimg=originalimg.replace("/upload","/upload/h_150,w_200,e_blur:50")
       res.render("listings/edit.ejs",{list,originalimg});
   };




module.exports.update=async (req,res)=>
{ 
    if(!req.body.listing){
        throw new ExpressError(400,"enter valid creditals");
    }
    let {id}=req.params;
   
   let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});

    if (typeof req.file!=="undefined") {
   listing.image = {
      url: req.file.path,         // Cloudinary URL
      filename: req.file.filename, // Cloudinary file ID
    };

   listing.save();
    }
    req.flash("success","Listing updated!!");
    res.redirect(`/show/${id}`);
};

module.exports.delete=async (req,res)=>
{
    let {id}=req.params;
    await listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!!");

    res.redirect("/listing");

};

// Simple search by title
module.exports.search = async (req, res) => {
  const q = req.query.q || ""; 
  const listings = await listing.find({
    title: { $regex: q, $options: 'i' } // case-insensitive, matches partial word
  });
  res.render("listings/index.ejs", { listings, q });
};
