require('dotenv').config();

let express     = require("express"),
    app         = express(),
    fs          = require("fs"),
    mongoose    = require("mongoose"),
    bodyParser  = require("body-parser"),
    jsSHA       = require("jssha"),
    FileReader  = require("filereader"),
    sha256      = require("sha256"),
    multer      = require("multer");
    
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public")); 

mongoose.connect("mongodb://localhost/doc-checker", {useNewUrlParser: true});

let docSchema = new mongoose.Schema({
    name: String,
    roll: String,
    hash_data: String,
    college: String,
    college_id: String
});

let Degree = mongoose.model("Degree", docSchema);

var upload = multer({ dest: 'public/documents/' });

app.get("/", function(req, res){
    res.render("index");
});

app.get("/upload", function(req, res){
    res.render("upload");
});

app.post("/upload", upload.any(), function(req, res){
//   console.log(req.files[0]);
   
   let name = req.body.name;
   let roll = req.body.roll;
   let college = req.body.college;
   let college_id = req.body.college_id;
   let file;
   let hash_data;
   let newDoc;
   
   fs.rename(req.files[0].path, req.files[0].destination + req.files[0].originalname, function(err){
        if (err){
           return console.log(err);
        }
        else{
           console.log("File renamed!");
           file = req.files[0].destination + req.files[0].originalname;
           
            fs.readFile(file, function(err, data){
                if (err){
                    return console.log(err);
                }
                else{
                    hash_data = sha256(data);
                    // console.log(hash_data);
                    newDoc = {
                       name: name,
                       roll: roll,
                       hash_data: hash_data,
                       college: college,
                       college_id: college_id
                    };
                   
                    console.log(newDoc);
                   
                    Degree.create(newDoc, function(err, createdDoc){
                        if (err){
                           console.log(err);
                           return res.redirect("back");
                        }
                        else{
                        //   console.log(createdDoc);
                           res.redirect("/");
                        }
                    });
                }
            });
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
   let hash_data;
   let newDoc;
   
   fs.rename(req.files[0].path, req.files[0].destination + req.files[0].originalname, function(err){
        if (err){
           return console.log(err);
        }
        else{
           console.log("File renamed!");
           file = req.files[0].destination + req.files[0].originalname;
           
            fs.readFile(file, function(err, data){
                if (err){
                    return console.log(err);
                }
                else{
                    hash_data = sha256(data);
                    // console.log(hash_data);
                    // PUT SCRIPT HERE
                }
            });
        }
   });
});

app.get("*", function(req, res){
    res.redirect("back");
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server started...");
});