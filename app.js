//jshint esversion:6

require('dotenv').config()
const express = require('express')
const bodyParser = require("body-parser")
const ejs = require('ejs')
const mongoose = require('mongoose')
// encrypting our database
const encrypt=  require('mongoose-encryption')


const app = express()


app.use(express("public"))
app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended:true}))

// connecting to database 
mongoose.connect('mongodb://localhost:27017/userDB')


// schema for the database
const userSchema = new mongoose.Schema({
    email:String,
    password:String
})

// encrypting the Schema for the database and adding field you want to encrypt
const secret = "Thisisourlittlesecret"
userSchema.plugin(encrypt,{secret:secret,encryptedFields:['password']})

// setting up the modal

const User = new mongoose.model('User', userSchema)

app.get("/", function(req,res){
    res.render('home')
})


app.get("/login", function(req,res){
    res.render('login')
})

app.get("/register", function(req,res){
    res.render('register')
})



////////////////////////// POST ROUTES ////////////////////////////

// post register
app.post("/register", function(req,res){
    const email = req.body.username;
    const password = req.body.password;

    // storing it in the database
    const newUser = User({
        email:email,
        password:password
    })

    newUser.save(function(err){
        if (err){
            console.log(err)
        }else{
            res.render('secrets')
        }
    })
})


app.post('/login', function(req,res){
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email:username}, function(err, foundUser){
        if(err){
            console.log(err)
        }else{
            if (foundUser){
                if (foundUser.password === password){
                    res.render('secrets')
                }
            }

        }
    })

    
})

app.listen(3000, function(){
    console.log("Server is started at localhost:3000")
})