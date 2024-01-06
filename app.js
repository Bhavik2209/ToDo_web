// jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const items=[]
const app = express();


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public")); // to be able to access css in list.ejs

mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser:true});

const itemSchema={
  name:String
};
const Item = mongoose.model(
  "Item",itemSchema
);

const item1 = new Item({
  name:"Welcome to your todolist"
});
const item2 = new Item({
  name:"todolist"
});
const item3 = new Item({
  name:"Welcome"
});

const defaultItems = [item1,item2,item3];

//GET function for home route
app.get ("/", function(req,res){
  
  Item.find({}).then((foundItem)=>{
    if(foundItem.length===0){
      Item.insertMany(defaultItems)
      .then(function (err) {
        if(!err){
          console.log("saved successfully !");
        }else{
          console.log(err);
        }
      });
      res.redirect("/");
    }
    else{
      res.render("list", {listTitle:"Today", newListItems: foundItem});
    }
  })

});
//POST function for home route
app.post("/", function(req, res){
  // console.log(req.body);
const itemName = req.body.newItem;

 const item = new Item({
  name:itemName
 })
 item.save();
 res.redirect("/");
});

app.post("/delete",(req,res)=>{
  const checkedItemId = req.body.checkbox;
  Item.findByIdAndDelete(checkedItemId).then((err)=>{
    if(!err){
      console.log("successfully removed");
    }
    res.redirect("/");
  })
});


//GET function for Work route
app.get("/work", function(req,res){
  res.render("list", {listTitle:"Work list", newListItems:workItems});
});

//POST function for home route
app.post("/work", function(req,res){
  const item = req.body.newItem;
  workItems.push(item);
  res.redirect("/work");
});

//GET function for About route

app.get("/about", function(req,res){
  res.render("about");
});


app.listen(3000, function(){
console.log("Server is running on port 3000");
});