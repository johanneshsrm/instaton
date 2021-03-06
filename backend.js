const Port = 3001;

const Fs = require("fs");
const Path = require("path");
const Express = require("express");
const Multer = require("multer");
const Mongoose = require("mongoose");
const Os = require("os");

let app = Express();
let upload = Multer({"dest": Os.tmpdir()});

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
    res.render('index.ejs', {posts: []});
});

app.get('/posts', function(req, res) {
    Posts.find().then(function (posts) {
        res.json(posts);
    });
});

app.post('/upload', upload.any(), function(req, res) {
    let imageInfo = req.files[0];
    let postInfo = req.body;

    Posts.create({
        id: imageInfo["filename"],
        author: postInfo["author"],
        title: postInfo["title"],
        liked: [],
        image: calculateBase64(imageInfo),
    }).then(function (post) {
        Fs.unlinkSync(Path.resolve(imageInfo["path"]));
        res.json(post);
    });
});

app.patch('/like', function(req, res) {
    let username = req.body["username"];
    let postId = req.body["id"];

    Posts.findOne({
        id: postId
    }).then(function (post) {
        if (!post["liked"].includes(username)) {
            post["liked"].push(username);
            post.save();
            res.json({"liked": true});
        } else {
            res.json({"liked": true});
        }
    }).catch(function () {
        res.json({"liked": false});
    });
});


/*
* FUNKTIONEN
* */

function calculateBase64(imageInfo) {
    let imageAsBase64 = Fs.readFileSync(Path.resolve(imageInfo["path"]), {encoding: "base64"});
    return `data:${imageInfo["mimetype"]};base64,${imageAsBase64}`;
}
