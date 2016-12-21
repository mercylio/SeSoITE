import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import './main.html';


//Scroll List
Session.set("bookListLimit", 10);
lastScrollTop = 0;

//Scrolling function
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

//Places the result in an array
Handlebars.registerHelper('arrayify',function(obj){
    result = [];
    for (var key in obj) result.push(obj[key]);
    return result;
});


//SIMPLE SEARCH
Template.search.events({
  "submit #search": function (e) {
      e.preventDefault();
      NProgress.start();

      Meteor.call('getSimpleSearch',Session.get("searchValue"),function(err, response) {
        Session.set('serverSimpleResponse', response);
        NProgress.done();
      });

      Session.set("searchValue", $("#searchValue").val());
      NProgress.remove();
    }
}),
    //sorting the table with a click on the column header
    $(function(){
      $("#myTable").tablesorter();
    });
;


//ADVANCED SEARCH
Template.advancedsearch.events({
  "submit #adv-search": function (e) {
      e.preventDefault();
      //NProgress.start();
      
      //collecting the parameters for the advanced search
      var scopeOne = $("#scopeOne option:selected").val();
      var scopeTwo = $("#scopeTwo option:selected").val();
      var categoryOne = $("#categoryOne option:selected").val();
      var categoryTwo = $("#categoryTwo option:selected").val();
      var condition = $("#condition option:selected").val();
      var searchValueOne = $("#searchValueOne").val();
      var searchValueTwo = $("#searchValueTwo").val();

      Meteor.call('getAdvancedResults',Session.get("scopeOne","categoryOne","searchValueOne"),function(err, response) {

        Session.set('serverSimpleResponse', response);
      });
      Session.set("scopeOne", $("#scopeOne").val(), "categoryOne", $("#categoryOne").val(), "searchValueOne", $("#searchValueOne").val());
      //NProgress.end();
    }
}),
    //sorting the table with a click on the column header
    $(function(){
      $("#myTable").tablesorter();
    });
;

//retrieves the results of the simple search and loads them into the page
Template.search.result = function () {
  return Session.get('serverSimpleResponse');
};

//retrieves the results of the advanced search and loads them into the page
Template.advancedsearch.result = function () {
  return Session.get('serverSimpleResponse');
};
