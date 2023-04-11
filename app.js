//importing dependencies
require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');


//usign dependencies
const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

//database connection
const uri = process.env.DB_URL;
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
.then(()=>{
    console.log('Connected to database');
})
.catch((err)=>{
    console.log(err);
})

//Schema mongodb and model
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const secret = process.env.SECRET_KEY;
userSchema.plugin(encrypt, { secret: secret , encryptedFields: ['password']});

const User = mongoose.model('User', userSchema);

app.get('/', (req, res) => {

    res.render('home');
})

app.get('/login', (req, res) => {
    res.render('login');
})

app.get('/register', (req, res) => {
    res.render('register');
})

app.post('/register', (req, res) => {
    //creating a new user
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    })
    //saving the new user
    newUser.save().then(()=>{
        console.log('User created');
        res.render('secrets');
    }).catch((err)=>{
        console.log(err);
    })
})

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    //finding the user
    User.findOne({email: username}).then((user)=>{
        if(user){
            if(user.password === password){
                console.log('User logged in');
                res.render('secrets');
            }else{
                console.log('Wrong password');
            }
        }
    }).catch((err)=>{
        console.log(err);
    })

})

//Server listening on port 3000
app.listen(3000, () => {
console.log('Server is running on port 3000');
})