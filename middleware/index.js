var Campground  = require("../models/campgrounds"),
    Comment     = require("../models/comment");

var middlewareObject = {};

middlewareObject.checkCampgroundOwnership = function(req, res, next){
  if(req.isAuthenticated()){
    Campground.findById(req.params.id, function(err, foundCampground){
      if(err){
        req.flash("error", "Campground not found");
        res.redirect("back");
      } else {
        // Does user own the campground?
        if(foundCampground.author.id.equals(req.user._id)){
          next();
        } else {
          req.flash("error", "You don't have permission to do that");
          res.redirect("back");
        }
      }
    });
  } else {
    res.redirect("back");
  }
}

middlewareObject.checkCommentOwnership = function(req, res, next){
  if(req.isAuthenticated()){
    Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err){
        res.redirect("back");
      } else {
        // Does user own the comment?
        if(foundComment.author.id.equals(req.user._id)){
          next();
        } else {
          req.flash("error", "You don't have permission to do that!");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "Please Log In First!");
    res.redirect("back");
  }
}

middlewareObject.isLoggedIn = function(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  req.flash("error", "You need to be logged in to do that!");
  res.redirect("/login");  
}

module.exports = middlewareObject;