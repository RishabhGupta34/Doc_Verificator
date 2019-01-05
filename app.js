require('dotenv').config();

let express     = require("express"),
    app         = express(),
    mongoose    = require("mongoose"),
    bodyParser  = require("body-parser"),
    jsSHA       = require("jssha");
    
mongoose.connect("mongodb://localhost/doc-checker", {useNewUrlParser: true});

let docSchema = new mongoose.Schema({
    name: String,
    roll: String,
    college: String,
    college_id: String,
    file: String
});

let Degree = mongoose.model("Degree", docSchema);

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));   

app.get("/", function(req, res){
    res.render("index");
});

app.get("/upload", function(req, res){
    res.render("upload");
});

app.post("/", function(req, res){
   let name = req.body.name;
   let roll = req.body.roll;
   let college = req.body.college;
   let college_id = req.body.college_id;
   let file;
   
   let myFile = req.body.file;
   
   var reader = new FileReader();
   reader.onload = function() {
       var actual_contents = reader.result.slice(reader.result.indexOf(',') + 1);
       var what_i_need = new jsSHA(actual_contents, "B64").getHash("SHA-256", "HEX");
   };
   file = reader.readAsDataURL(myFile);
   
   let newDoc = {
       name: name,
       roll: roll,
       college: college,
       college_id: college_id,
       file: file
   };
   
   Degree.create(newDoc, function(err, createdDoc){
       if (err){
           console.log(err);
           return res.redirect("back");
       }
       else{
           console.log(createdDoc);
           res.redirect("/");
       }
   });
});

app.get("/verify", function(req, res){
    res.render("verify");
});

app.post("/verify", function(req, res){
   let name = req.body.name;
   let roll = req.body.roll;
   let college = req.body.college;
   let college_id = req.body.college_id;
   let file;
   
   let myFile = req.body.file;
   
   var reader = new FileReader();
   reader.onload = function() {
       var actual_contents = reader.result.slice(reader.result.indexOf(',') + 1);
       var what_i_need = new jsSHA(actual_contents, "B64").getHash("SHA-256", "HEX");
   };
   file = reader.readAsDataURL(myFile);
   
   let docObj = {
       name: name,
       roll: roll,
       college: college,
       college_id: college_id,
       file: file
   }
   
});

app.get("*", function(req, res){
    res.redirect("back");
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server started...");
});