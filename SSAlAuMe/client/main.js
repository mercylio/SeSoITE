import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

/// ROUTING
/// guide - http://iron-meteor.github.io/iron-router/
Router.configure({
	layoutTemplate: 'ApplicationLayout'//the default template we're going to use, is called ApplicationLayout, which will be a super template, into which we can insert other templates. So we will have one global layout, and we can swap out the components
});

Router.route('/:page?', function () {
	if(Meteor.user()){//if logged in user
		this.render('navbar', {to: "navbar"});
		this.render('msgContainer', {to: "msgContainer"});
		this.render('messages', {to: "messages"});
		this.render('inputMessages', {to: "inputMessages"});
	}
	else {//if anonymous
		this.render('navbar', {to: "navbar"});
		this.render('msgContainer', {to: "msgContainer"});
		this.render('messages', {to: "messages"});
		this.render('notAllowedToPost', {to: "inputMessages"});//not allowed
	}
});

 //Infinite Scroll
Session.set("messageLimit", 10);
lastScrollTop = 0;
$(window).scroll(function(event){
	//test if we're near the bottom of the window
	if($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
		//where are we?
		var scrollTop = $(this).scrollTop();
		//test if we are going down
		if(scrollTop > lastScrollTop){
			//yes we're going down
			Session.set("messageLimit", Session.get("messageLimit") + 4);
		}
		lastScrollTop = scrollTop;

	}
});

/// accounts configuration
Accounts.ui.config({
    passwordSignupFields: "USERNAME_AND_EMAIL"
});

function messages (){
		var msgs = Messages.find({}, {sort:{'time': -1}, limit:Session.get("messageLimit") });
		return msgs;
}

Template.messages.helpers({
	messages (){
		var msgs = Messages.find({}, {sort:{'time': -1}, limit:Session.get("messageLimit") });
		return msgs;
	}

	/*
	customers: function() {
    return Messages.find();
  	},
  	prevPage: function() {
    var previousPage = currentPage === 1 ? 1 : currentPage - 1;
    return Router.routes.messages.path({page: previousPage});
  	},
  	nextPage: function() {
    var nextPage = hasMorePages() ? currentPage() + 1 : currentPage();
    return Router.routes.messages.path({page: nextPage});
  	},
  	prevPageClass: function() {
    return currentPage() <= 1 ? "disabled" : "";
  	},
  	nextPageClass: function() {
    return hasMorePages() ? "" : "disabled";
  }*/
});


//Message insertion
Template.inputMessages.events({
	'submit form':function(event){
		
		Template.helpers
		//we test whether the user is logged in or not. If not, we won't allow insertion.
		if(Meteor.user()){

			//TODO: do the check on string length here
			var text = $("#commentbox").val();
			var tagsbox = $("#tagsbox").val();

			if ((text != "") && (tagsbox != "")){
				//max lenght allowed: 140 textbox (like Twitter), 140 also for tags
				if ((text.length < 140) && (tagsbox.length < 140)){
					
					var time = new Date();
					var author = Meteor.user().username;

					//split tags and exclude eventual "," or words after
					var tags = tagsbox.split(",");
					/*
					//CHECK WHAT TAGS have been extracted from the input
					for(var i=0;i<tags.length;i++){
						console.log("ELEMENT nr: "+i+" of Tags. Value: "+tags[i]);
					}*/
					//console.log(tags+"_TAGS: just extracted:\n\n");

					//PURGE from empty values
					var purgedTags = [];
					for(var i=0;i<tags.length;i++){
						if(tags[i]){
							purgedTags.push(tags[i].trim());
						}
					}
					//console.log(purgedTags+"_PURGED from commas:\n\n");
					purgedTags.sort();
					//console.log(purgedTags+"_PURGED & SORTED!:\n\n");

					//CHECK DUPLICATE TAGS
					function unique(list) {
					    var result = [];
					    $.each(list, function(i, e) {
					        if ($.inArray(e, result) == -1) result.push(e);
					    });
					    return result;
					}

					var cleanTags = unique(purgedTags);
					//console.log(cleanTags);
					
					//Insert into DB
					Messages.insert({
						author: author,
						time: time, 
						tags: cleanTags, 
						text: text
					});

					//some jQuery to append the message into the current view (if it is not >10-20 msgs)
					var html = $("<span id=\"author\" class=\"badge\">"+author+"</span> <span class=\"badge\">"+time+"</span><span class=\"label label-primary\"> TAGS: "+cleanTags.toString()+"</span>"+"<li id=\"msg-text\">"+text+"</li>");
					//html.prependTo('#comments');
					$("#commentbox").val("");
				}

				//ELSE output a message for the USER: "NOT ALLOWED! you entered more than "
				//TODOOO
			}

		return false; // we avoid the default operation of the event handler (here is a "reload the page" when we press 'save' in the form)	
		}
	}
});

//Pagination
Template.messages.onCreated(function() {
  var template = this;

  template.autorun(function(){
  	var skipCount = (currentPage() - 1) * Meteor.settings.public.recordsPerPage;
    template.subscribe('messages', skipCount);
  });
});


Template.messages.events({
	
	/*
	'click #btnAddMessage': function(e) {
    	e.preventDefault();

    	Router.go('addMessage');
  	}
	*/

  	//When filter button is pressed
	'click #goFilter':function(event) {

		var keyword = $("#searchinput").val();
		var filtertype = $("#filterSelect").val();

		if((keyword != "") && (keyword.length < 140)){
			switch (filtertype) {
				case 'author':
					
					//var msgs = Messages.find({'author': keyword},{sort:{'time': -1}, limit:Session.get("messageLimit") });
					//if found any, then: clear and print results
					$('#comments').empty();

					for(i=0;i<Messages.find().count();i++){
						if(Messages.find().fetch()[i].author == keyword){

						var html = "<span id=\"author\" class=\"badge\">"+keyword+"</span> <span class=\"badge\">"+Messages.find().fetch()[i].time+"</span>"+"<span class=\"label label-primary\"> TAGS: "+Messages.find().fetch()[i].tags+"</span>"+"<li id=\"msg-text\">"+Messages.find().fetch()[i].text+"</li>";
						$(html).prependTo('#comments');
							/*
							console.log("Message text is: "+Messages.find().fetch()[i].text);
							console.log("Created by: "+Messages.find().fetch()[i].author);
							console.log("At time: "+Messages.find().fetch()[i].time);
							console.log("With tags: "+Messages.find().fetch()[i].tags);
							*/
						}
					}
					return false;
					//$('#comments').prependTo(#comments);
					//Clear id="comments" and print results
					//html.prependTo('#comments');
					


					//https://docs.mongodb.com/manual/reference/method/cursor.forEach/
					/*
					var firstpart = "<span class='badge'>"+author+" - "+time+"</span>";
					var middle = "<span class='label label-primary'>TAGS: {{tags}}</span>";
		    		var third = "<li id='msg-text'> {{text}} </li>";
					var html = $("<span class=\"badge\">"+author+" - "+time+"</span>"+"<span class=\"label label-primary\"> TAGS: "+"</span>"+"<li>"+text+"</li>");
					$('#comments').append(firstpart+middle+third+html);
					*/
					break;

				case 'tag':
					//neeed to PURGE TAGS INPUT for multiple values!!!!!!!!!!!!
					/*
					var purge = keyword.split(",");
					var purgedTags = [];
					for(var i=0;i<purge.length;i++){
						if(purge[i]){
							purgedTags.push(purge[i].trim());
						}
					}
					purgedTags.sort();
					*/

					$('#comments').empty();

					for(var i=0;i<Messages.find().count();i++){
						var tagArray = Messages.find().fetch()[i].tags;

						//console.log(tagArray);
						for(var j=0;j<tagArray.length;j++){
							if(tagArray[j] == keyword){

							var html = "<span id=\"author\" class=\"badge\">"+Messages.find().fetch()[i].author+"</span> <span class=\"badge\">"+Messages.find().fetch()[i].time+"</span>"+"<span class=\"label label-primary\"> TAGS: "+Messages.find().fetch()[i].tags+"</span>"+"<li id=\"msg-text\">"+Messages.find().fetch()[i].text+"</li>";
							$(html).prependTo('#comments');
							}
						}						
					}
					return false;
					break;

				/*
				case 'tag':
					//neeed to PURGE TAGS INPUT for multiple values!!!!!!!!!!!!
					var purge = keyword.split(",");
					var purgedTags = [];
					for(var i=0;i<purge.length;i++){
						if(purge[i]){
							purgedTags.push(purge[i].trim());
						}
					}
					purgedTags.sort();
					$('#comments').empty();

					var matchingTags = [];
					//TRIPLE FOR!
					for(var i=0;i<Messages.find().count();i++){
						//tags[i] current pointer
						var tagArray = Messages.find().fetch()[i].tags;


						//console.log(tagArray);
						for(var j=0;j<tagArray.length;j++){
							var countz = 0;
							for(var z=0;z<purgedTags.length;z++){
								if(purgedTags[z]==tagArray[j]){
									countz++;
								}
							}
							if (countz=purgedTags.length){
								matchingTags.push(Messages.find().fetch()[i]);
							}
						}					
					}

					for (var i = 0; i < matchingTags.length; i++) {
							var html = "<span id=\"author\" class=\"badge\">"+matchingTags[i].author+"</span> <span class=\"badge\">"+matchingTags[i].time+"</span>"+"<span class=\"label label-primary\"> TAGS: "+matchingTags[i].tags+"</span>"+"<li id=\"msg-text\">"+matchingTags[i].text+"</li>";
							$(html).prependTo('#comments');
					}
					return false;
					break;

				*/


				//default:

			}
			return false; //avoid reloading of browser page on form submit
		}
	},

	//BTN CANCEL
	'click #cancelFilter':function(){

		var keyword = $("#searchinput").val();
		if(keyword){
			$("#searchinput").val("");
			$('#comments').empty();
			for(i=0;i<Messages.find().count();i++){

				var html = "<span id=\"author\" class=\"badge\">"+Messages.find().fetch()[i].author+"</span> <span class=\"badge\">"+Messages.find().fetch()[i].time+"</span>"+"<span class=\"label label-primary\"> TAGS: "+Messages.find().fetch()[i].tags+"</span>"+"<li id=\"msg-text\">"+Messages.find().fetch()[i].text+"</li>";
				$(html).prependTo('#comments');
				
			}
			return false;

		}
		
		
	}
	
	
});

var hasMorePages = function() {
  var totalMessages = Counts.get('messagesCount');
  return currentPage() * parseInt(Meteor.settings.public.recordsPerPage) < totalMessages;
}

var currentPage = function() {
  return parseInt(Router.current().params.page) || 1; 
}