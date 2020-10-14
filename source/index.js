const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary");
const multipart = require("connect-multiparty");
const timeago = require("timeago.js");

require('dotenv').config();

const multipartMiddleware = multipart();
const Post = require('./models');

try {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
} catch(error) {
  if (isDevelopment) throw error;
}

mongoose.connection.on('error', (error) => {
  if (isDevelopment) throw error;
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const port = process.env.PORT || 8080;
const isDevelopment = process.env.NODE_ENV === "development";

// names of fake users;
const fakeNames = ['Gideon', 'Shedrack', 'Samson', 'Steven', 'Olaolu', 'Wonderful'];

app.use(express.static('./public'));
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (request, response) => {
  Post.find((error, posts) => {
    if (error && isDevelopment) throw error;

    return response.render('pages/home', {
      posts: posts
        .sort((a, b) => b.createdAt - a.createdAt)
        .map(post => Object.assign(post, {
          createdAt: timeago.format(post.createdAt)
        }))
    });
  });
});

app.post('/posts', multipartMiddleware, (request, response) => {

  cloudinary.uploader.upload(request.files.photo.path, (result) => {
    new Post({
      user: fakeNames[Math.trunc(Math.random() * fakeNames.length)],
      url: result.url,
      caption: request.body.caption,
      createdAt: new Date().getTime()
    }).save();

    return response.redirect('/');
  });

});

app.all("*", (request, response) => response.redirect('/'));

app.listen(port, () => isDevelopment && console.log(`Mini-instagram is running on http://localhost:${port}`));