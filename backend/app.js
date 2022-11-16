const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
 const cors = require('cors');

const app=express();
app.use(bodyParser.json());
app.use(cors());

mongoose.connect("mongodb://localhost:27017/notaryDB");

const userSchema = new mongoose.Schema({
  name:{type:String,unique:true},
  email:{type:String,unique:true},
  referer:String,
  isPaymentMade:String,
  totalEarnings:Number
});

const User = new mongoose.model("user",userSchema);

app.post("/postuser",(req,res)=>{
  const{name, email, referer} = req.body;
  const user = new User({
    name:name,
    email:email,
    referer:referer?referer:"NULL",
    isPaymentMade:"false",
    totalEarnings:0
  })
  user.save();

});

app.get("/getusers",(req,res)=>{
  User.find({},(err,users)=>{
    res.json(users);
  })
})

app.post("/mkchange",(req,res)=>{


  User.findOne({_id:req.body.id},(err,user)=>{
console.log(user.isPaymentMade);
    if(user.isPaymentMade==="false"){

      User.findOne({name:user.referer},(err,user2)=>{
        console.log(user2.totalEarnings);

        user2.totalEarnings += 10;
        user2.save();
        res.json({referer:user2.name,referedto:user.name})
      })

      user.isPaymentMade="true";

      user.save();
    }else{
      res.json({success:false,message:"User already did first payment."})
    }
  })



})






app.listen("4000",(req,res)=>{
  console.log("running on port 4000.");
})
