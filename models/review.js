const mongoose=require("mongoose");
const { Schema } = mongoose;
const reviewschema = new mongoose.Schema({
    commet:String,
    rating:{
        type:Number,
        min:1,
        max:5

    },
    createdAt:{
        type:Date,
        default:Date.now(),
        
    },
    author:{
        type:Schema.Types.ObjectId,
         ref:"User",
    }



});

module.exports = mongoose.model("Review",reviewschema);
