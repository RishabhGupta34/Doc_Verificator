require('dotenv').config();

let express     = require("express"),
    app         = express(),
    mongoose    = require("mongoose"),
    bodyParser  = require("body-parser");
    
    
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server started");
})