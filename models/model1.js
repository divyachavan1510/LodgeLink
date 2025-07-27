const mongoose=require("mongoose");
const { Schema } = mongoose;
const Review=require("./review.js");

const listschema=new mongoose.Schema({
   title:
   {
    type:String,
    required:true,},

   description:String,
   image:{
    type: {
    url: String,
    filename: String
  },},
    
   price:Number,
   location:String,
   country:String,
   reviews:[
      {
         type:Schema.Types.ObjectId,
         ref:"Review",
      }
   ],
   owner:{     
         type:Schema.Types.ObjectId,
         ref:"User",
   },

});


listschema.post("findOneAndDelete",async (listing)=>{
   if(listing){
      await Review.deleteMany({_id:{$in:listing.reviews}});
   }
});


const Listing=mongoose.model("Listing",listschema);
module.exports=Listing;