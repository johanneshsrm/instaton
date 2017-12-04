const Port = 3001;

const Fs = require("fs");
const Path = require("path");
const Express = require("express");
const Multer = require("multer");
const Mongoose = require("mongoose");

let app = Express();
let upload = Multer({"dest": "./uploads/"});

app.set('views', Path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(Express.urlencoded({ extended: true }));
app.use('/uploads', Express.static('uploads'));
app.use(Express.static('frontend'));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET,POST,PATCH");
    next();
});

app.listen(Port, function () {
    console.log('Instaton-Server running...');
});

/*
* Oberhalb hiervon bitte nichts editieren oder einfügen.
* Unter diesen Kommentar kommt Ihr Code :)
* */

Mongoose.connect('mongodb://138.68.107.150/instaton');

const Posts = Mongoose.model(
    'posts',
    new Mongoose.Schema({
        id: String,
        image: String,
        title: String,
        author: String,
        liked: Array
    })
);


/*
* ROUTEN
* */

app.get('/', function(req, res) {
    Posts.find().then(function (posts) {
        res.render('index.ejs', {posts: posts});
    });
});


/*
* FUNKTIONEN
* */
