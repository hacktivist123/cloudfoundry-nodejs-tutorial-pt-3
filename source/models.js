const { Schema, model } = require('mongoose');

const postSchema = Schema({
  url: String,
  caption: {
    type: String,
    minLength: 5
  },
  user: {
    type: String,
    minLength: 2,
  },
  createdAt: String
});

const Post = model('Post', postSchema);

module.exports = Post;