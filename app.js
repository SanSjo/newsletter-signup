var express = require("express");
var bodyParser = require("body-parser");
var request = require("request");
const https = require("https");
require("dotenv").config();

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}))

app.get("/", function(req,res) {
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", function(req, res){
    var apiKey = process.env.API_KEY;
    var listId = process.env.LIST_ID;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const result = firstName + lastName + email;
    console.log(firstName, lastName, email);

    var data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,
                   
                }
            }
        ]
    };

    var jsonData = JSON.stringify(data);
    const url = `https://us1.api.mailchimp.com/3.0/lists/${listId}`;
    const options = {
        method: "POST",
        auth: "sus1:"+apiKey+""
        
    }

    console.log(process.env.api_Key)

        const request = https.request(url, options, function(response){

            if(response.statusCode === 200) {
                
                res.sendFile(__dirname + "/success.html");
            } else 
            {
                res.sendFile(__dirname + "/failure.html");

            }

            response.on("data", function(data) {
                console.log(JSON.parse(data));
            })
        });
    
        request.write(jsonData);
        request.end();
   
})

app.post("/failure", function(req, res) {
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, function() { //works both on heroku and locally
    console.log("Server is running on 3000")
})

