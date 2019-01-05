require('dotenv').config();

let express     = require("express"),
    app         = express(),
    mongoose    = require("mongoose"),
    bodyParser  = require("body-parser");
    
mongoose.connect("mongodb://localhost/doc-checker", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));   

app.get("/", function(req, res){
    res.render("index");
});

app.get("/upload", function(req, res){
    res.render("upload");
});

app.get("/verify", function(req, res){
    res.render("verify");
});

app.get("*", function(req, res){
    res.redirect("back");
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server started...");
});