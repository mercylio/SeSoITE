import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session'

import './main.html';

//ROUTING


//Account Configuration
Accounts.ui.config({
	passwordSignupFields: "USERNAME_AND_EMAIL"
});

Template.books.helpers({
  books:function(){
    
  }
});