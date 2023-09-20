const serverless = require("serverless-http");
const express = require("express");
const userModel = require("./model/user");
const mongoose = require("mongoose");
const app = express();

mongoose.connect('mongodb://localhost:27017/users')
.then(()=>console.log('connected to db'))
.catch((error)=>console.log('db connection error',error))

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.get('/',async (req,res,next)=>{
  try {
    let data = await userModel.find();
   res.json({'data':data}); 
  } catch (error) {
    res.json({'error':error.message});
  }
});

app.post('/',async (req,res,next)=>{
    try {
      let udata = new userModel({
           name:req.body.name,
           email:req.body.email
      }); 
      let data = await udata.save();
      res.json({'data':data});
    } catch (error) {
      res.json({'error':error.message});
    }
});

app.delete('/:id',async(req,res,next)=>{
       try {
         let data  = await userModel.deleteOne({"_id":req.params.id});
         res.json({'data':data});   
       } catch (error) {
         res.json({'error':error.message});
       }
});

app.put('/',async (req,res,next)=>{
     try {
        let data = {
          name : req.body.name,
          email: req.body.email
        }
      let d =  await userModel.updateOne({"_id":req.body.id},{$set:data});
      res.json({'data':d});
     } catch (error) {
      res.status(401).json({'error':error.message})
     }
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

module.exports.handler = serverless(app);
