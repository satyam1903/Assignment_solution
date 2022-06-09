// jshint esversion:6
const express=require("express");
const mongoose = require('mongoose');
const app=express();
const { json } = require("express/lib/response");


mongoose.connect('mongodb://127.0.0.1:27017/operator',
{useUnifiedTopology: true,useNewUrlParser: true},
   () =>console.log("connnected")
);

let user = mongoose.model('user', new mongoose.Schema());
app.use(express.static(__dirname + '/public'));
app.set("view engine","ejs");


//  -------------------------GET /operator -> List all operators----------------------------------------------- 

app.get("/operator",function(req,res){
 
   user.distinct("operator", function (err, result) {
      res.render("index",{"Title":"Operator List","opName":result});
      // console.log(results);
    
   });

}); 


// ----------------------------- GET /operatorGameType------------------------------------------------- 

app.get("/operatorGameType",function(req,res){
   user.distinct("operatorGameType",function(err,result){
      res.render("index",{"Title":"Operator Game Type","opName":result});
   })

});

// --------------------> GET /operatorName?operator=Fanduel&operatorGameType=Single Game----------------

app.get("/operatorName",function(req,res){
    user.distinct("operatorName",{operator:req.query.operator,operatorGameType:req.query.operatorGameType},function(err,result){
      res.render("index",{"Title":"Operator Name","opName":result});
    })
   });
   
   // -----------------------> GET /players?operator=&operatorGameType=&operatorName=?-------------------  
   app.get("/players",function(req,res){
          
      user.distinct("dfsSlatePlayers.operatorPlayerName",{operator:req.query.operator,operatorGameType:req.query.operatorGameType,operatorName:req.query.operatorName},function(err,result){
         res.render("index",{"Title":"List of Players","opName":result});
      })
   });   
   

   // ---------------> GET /players/best?operator=&operatorGameType=&operatorName=? ---------------------
   app.get("/players/best",function(req,res){
  
   
   user.aggregate([ 
         {$unwind:"$dfsSlatePlayers"},
            {
                  $match: {operator:req.query.operator,operatorGameType:req.query.operatorGameType,operatorName:req.query.operatorName}
            },
            { $group: {
                  _id:"$dfsSlatePlayers",
                  highest: {$max: "$dfsSlatePlayers.fantasyPoints"}
            }},
            {$sort:{highest:-1}},
            {$limit:1},    
         ],function(err,result){
            res.render("index",{"Title":"Best Player","opName":result[0]._id.operatorPlayerName});
          
           
         });
        
});

app.listen(3000|| process.env.PORT);






