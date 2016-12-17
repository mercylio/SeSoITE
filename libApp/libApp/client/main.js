import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
//import { Session } from 'meteor/session'

Books = new Mongo.Collection("books");

import './main.html';


//INFINITE SCROLL
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

Template.search.result = function () {
  return Session.get('serverSimpleResponse');
};

Template.advancedsearch.result = function () {
  return Session.get('serverSimpleResponse');
};


//SEARCH
Template.search.events({
  "submit #search": function (e) {
      e.preventDefault();
      //NProgress.start();
      //Meteor.call('getCurrentTime',function(err, response){
      Meteor.call('getSimpleSearch',Session.get("searchValue"),function(err, response) {
        //console.log(response);
        //NProgress.inc();
        Session.set('serverSimpleResponse', response);
      });
      //NProgress.inc();
      Session.set("searchValue", $("#searchValue").val());
      //NProgress.done();
      //NProgress.remove();
    }
}),
    $(function(){
      $("#myTable").tablesorter();
    });
;

Template.search.helpers({

});

Handlebars.registerHelper('arrayify',function(obj){
    result = [];
    for (var key in obj) result.push(obj[key]);
    return result;
});

//ADVANCED SEARCH
Template.advancedsearch.events({
  "submit #adv-search": function (e) {
      e.preventDefault();
      //NProgress.start();
      //Meteor.call('getAdvancedResults',function(err, response){
      
      var scopeOne = $("#scopeOne option:selected").val();
      var scopeTwo = $("#scopeTwo option:selected").val();
      var categoryOne = $("#categoryOne option:selected").val();
      var categoryTwo = $("#categoryTwo option:selected").val();
      var condition = $("#condition option:selected").val();
      var searchValueOne = $("#searchValueOne").val();
      var searchValueTwo = $("#searchValueTwo").val();



      Meteor.call('getAdvancedResults',Session.get("scopeOne","categoryOne","searchValueOne"),function(err, response) {
        //console.log(response);
        Session.set('serverSimpleResponse', response);
      });
      Session.set("scopeOne", $("#scopeOne").val(), "categoryOne", $("#categoryOne").val(), "searchValueOne", $("#searchValueOne").val());
      //NProgress.end();
    }
})
,
    $(function(){
      $("#myTable").tablesorter();
    });
;

Template.advancedsearch.helpers({
/*  books: function() {
    Meteor.subscribe("adv-search", Session.get("searchFieldOne"));
    if (Session.get("searchFieldOne")) {
        return Books.find({}, { sort: [["score", "desc"]] });  
      } else {
        return Books.find({});
      }
    }*/
});