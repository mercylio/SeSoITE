import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
//import { Session } from 'meteor/session'

Books = new Mongo.Collection("books");

import './main.html';

//ROUTING


//Account Configuration
Accounts.ui.config({
	passwordSignupFields: "USERNAME_AND_EMAIL"
});

//Infinite Scroll
Session.set("bookListLimit", 10);
lastScrollTop = 0;
$(window).scroll(function(event){
  //test if we're near the bottom of the window
  if($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
    //where are we?
    var scrollTop = $(this).scrollTop();
    //test if we are going down
    if(scrollTop > lastScrollTop){
      //yes we're going down
      Session.set("bookListLimit", Session.get("bookListLimit") + 4);
    }
    lastScrollTop = scrollTop;

  }
});

//BOOKS
Template.books.rendered = function() {
    Session.setDefault('books', [
      {title: "To Kill a Mockingbird", value: "To Kill a Mockingbird", author: "Harper Lee"},
      {title: "1984", value:  "1984", author: "George Orwell"},
      {title: "The Lord of the Rings", value: "The Lord of the Rings", author: "J. R. R. Tolkien"},
      {title: "The Catcher in the Rye", value: "The Catcher in the Rye", author: "J. D. Salinger"},
      {title: "The Great Gatsby", value: "The Great Gatsby", author: "F. Scott Fitzgerald"}
    ]);
  };


Template.books.helpers({
  books:function(){
    return Session.get('books');
  }
});

Template.search.result = function () {
  return Session.get('serverSimpleResponse');
};


//SEARCH
Template.search.events({
  "submit #search": function (e) {
      e.preventDefault();
      Meteor.call('getCurrentTime',function(err, response) {
        //console.log(response);
        Session.set('serverSimpleResponse', response);
      });
      Session.set("searchValue", $("#searchValue").val());
    }
});

Template.search.helpers({
  books: function() {
    Meteor.subscribe("search", Session.get("searchValue"));
    if (Session.get("searchValue")) {
        return Books.find({}, { sort: [["score", "desc"]] });  
      } else {
        return Books.find({});
      }
  }
});

Handlebars.registerHelper('arrayify',function(obj){
    result = [];
    for (var key in obj) result.push(obj[key]);
    return result;
});
