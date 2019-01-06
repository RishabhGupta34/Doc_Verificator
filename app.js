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
    
var Web3=require('web3'); 
 // set the provider you want from Web3.providers
var web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/cbfbd8fd2d124b66890e2c0ad4f0ebd3'));

web3.eth.defaultAccount = web3.eth.accounts[0];
console.log(web3.eth.accounts[0]);
var CoursesContract = web3.eth.contract([
	{
		"constant": false,
		"inputs": [
			{
				"name": "_s_id",
				"type": "string"
			},
			{
				"name": "_c_id",
				"type": "string"
			},
			{
				"name": "_doc_hash",
				"type": "string"
			}
		],
		"name": "getstud",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_s_name",
				"type": "string"
			},
			{
				"name": "_s_id",
				"type": "string"
			},
			{
				"name": "_c_id",
				"type": "string"
			},
			{
				"name": "_doc_hash",
				"type": "string"
			},
			{
				"name": "_c_name",
				"type": "string"
			}
		],
		"name": "newstudent",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_a",
				"type": "string"
			},
			{
				"name": "_b",
				"type": "string"
			}
		],
		"name": "strConcat",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_a",
				"type": "string"
			},
			{
				"name": "_b",
				"type": "string"
			}
		],
		"name": "stringsEqual",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	}
]);
var Doc_verificator = CoursesContract.at('0xd690b3e15c53572cb54a63720eae3961e2e3ec1d');
    
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public")); 

mongoose.connect(process.env.DATABASEURL, {useNewUrlParser: true});

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
                   Doc_verificator.newstudent(name,roll,college_id,hash_data,college);
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

app.post("/verify", upload.any(), function(req, res){
   let roll = req.body.roll;
   let college_id = req.body.college_id;
   let file;
   let hash_data;

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
                    console.log(Doc_verificator.getstud(roll,college_id,hash_data));
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