const Port = 3001;

const Fs = require("fs");
const Path = require("path");
const Express = require("express");
const Multer = require("multer");

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


/*
* ROUTEN
* */

app.get('/', function(req, res) {
    res.render('index.ejs', {posts: loadPosts()});
});


/*
* FUNKTIONEN
* */

function loadPosts() {
    return JSON.parse(Fs.readFileSync('./posts.json'));
}
