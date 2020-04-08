const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const express = require('express');
var bodyParser = require('body-parser');

const app = express();
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser());

var secret = speakeasy.generateSecret({
    name: '2FA Test code'
});
console.log(secret);

qrcode.toDataURL(secret.otpauth_url, function(err, data){
    console.log(data);
    app.get('/', function (req, res) {
        //res.sendFile('public/index.html', { root: __dirname });
        res.render('index', { data: data });
    });

    app.get('/verify', function (req, res) {        
        res.render('verify');        
    });

    app.post('/check', function (req, res, next) { 
        var token = req.body.code;
        console.log("token "+token); 
        console.log("secret "+secret.ascii);       
        var verified = speakeasy.totp.verify({
            secret: secret.ascii,
            encoding: 'ascii',
            token: token
        });

        if(verified)
        {
            res.send("You are authorised");
        }
        else{
            res.send("You are unauthorised");
        }
             
    });    

    app.listen(3000);
});






