// Create web server
var express = require('express');
var router = express.Router();
var Comment = require('../models/comment');
var Post = require('../models/post');

// Create new comment
router.post('/', function(req, res, next) {
  // Create new comment with form data
  var comment = new Comment(req.body);
  // Save comment to database
  comment.save(function(err, comment) {
    if (err) { return next(err); }
    // Find post with matching id
    Post.findById(comment.post, function(err, post) {
      if (err) { return next(err); }
      // Push comment into post's comments array
      post.comments.push(comment);
      // Save post
      post.save(function(err, post) {
        if (err) { return next(err); }
        // Send comment back to client
        res.json(comment);
      });
    });
  });
});

// Get all comments
router.get('/', function(req, res, next) {
  Comment.find(function(err, comments) {
    if (err) { return next(err); }
    res.json(comments);
  });
});

// Get one comment
router.get('/:id', function(req, res, next) {
  Comment.findById(req.params.id, function(err, comment) {
    if (err) { return next(err); }
    res.json(comment);
  });
});

// Update comment
router.put('/:id', function(req, res, next) {
  Comment.findByIdAndUpdate(req.params.id, req.body, function(err, comment) {
    if (err) { return next(err); }
    res.json(comment);
  });
});

// Delete comment
router.delete('/:id', function(req, res, next) {
  Comment.findByIdAndRemove(req.params.id, req.body, function(err, comment) {
    if (err) { return next(err); }
    res.json(comment);
  });
});

// Export router
module.exports = router;