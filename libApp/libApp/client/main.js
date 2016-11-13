import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

//ROUTING
Router.configure({
	layputTemplate: 'ApplicationLayout'
});

Router.route('/nav', function () {
  this.render('navbar', {
    to: "navbar"
  });
});

Router.route('/:page?', function() {
  if(Meteor.user()){//if logged in user
    this.render('navbar', {to: "navbar"});
    this.render('mainContainer', {to: "mainContainer"});
    this.render('footer', {to: "footer"});
  }
  else {//if anonymous
    this.render('navbar', {to: "navbar"});
    this.render('mainContainer', {to: "mainContainer"});
    this.render('footer', {to: "footer"});//not allowed
  }
});


//Accound Config
Accounts.ui.config({
	passwordSignupFields: "USERNAME_AND_EMAIL"
});


Template.hello.onCreated(function helloOnCreated() {
  // counter starts at 0
  this.counter = new ReactiveVar(0);
});

Template.hello.helpers({
  counter() {
    return Template.instance().counter.get();
  },
});

Template.hello.events({
  'click button'(event, instance) {
    // increment the counter when button is clicked
    instance.counter.set(instance.counter.get() + 1);
  },
});
