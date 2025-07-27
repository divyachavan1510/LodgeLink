const mongoose=require("mongoose");
const initdata=require("./data");
const listing=require("../models/model1.js");

main().then(()=>
{
    console.log("successful connection with database")
}).catch((err)=>
{
console.log(err);
})

async function main()
{
    await mongoose.connect('mongodb://127.0.0.1:27017/project1');
}

const initDB=async ()=>
{
    await listing.deleteMany({});
    const initdata1=initdata.map((obj)=>({...obj,owner:"686199346125526df014687b"}));
    await listing.insertMany(initdata1);
    console.log("data saved and connected");
}
initDB();
