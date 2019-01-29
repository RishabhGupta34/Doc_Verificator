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

const MetaMaskConnector = require('node-metamask');
// const connector = new MetaMaskConnector({
//   port: 8000, // this is the default port
//   onConnect() { console.log('MetaMask client connected') }, // Function to run when MetaMask is connected (optional)
// });  
var Web3=require('web3'); 
// var web3 = new Web3();
 // set the provider you want from Web3.providers
// connector.start().then(() => {
//   // Now go to http://localhost:3333 in your MetaMask enabled web browser.
//   const web3 = new Web3(connector.getProvider());
//   // Use web3 as you would normally do. Sign transactions in the browser.
// });				
// web3 = new Web3(web3.setProvider(web3.currentProvider));
var web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'));
// web3.eth.defaultAccount = "0xba9c4d0B37043b1bF0b5c494cEB5e42cBa88B071"
web3.eth.defaultAccount = web3.eth.accounts[1];
console.log(web3.eth.defaultAccount);
var CoursesContract = web3.eth.contract([
	{
		"constant": false,
		"inputs": [
			{
				"name": "_s_id",
				"type": "int256"
			},
			{
				"name": "_c_id",
				"type": "int256"
			},
			{
				"name": "_doc_hash",
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
		"constant": true,
		"inputs": [
			{
				"name": "_s_id",
				"type": "int256"
			},
			{
				"name": "_c_id",
				"type": "int256"
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
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
]);
var Doc_verificator = CoursesContract.at(process.env.CONTRACT_ADDRESS);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public")); 

mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true});

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
                   Doc_verificator.newstudent(roll,college_id,hash_data);
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
                    // var tr=Doc_verificator.getstud(roll,college_id,hash_data);
                    console.log(Doc_verificator.getstud(roll,college_id,hash_data));
                    // var receipt = web3.eth.getTransactionReceipt(tr);
                    // console.log(receipt);
                    res.redirect("/");
                }
            });
        }
   });
});

app.get("*", function(req, res){
    res.redirect("back");
});

app.listen(8000, process.env.IP, function(){
    console.log("Server started...");
});