import { Meteor } from 'meteor/meteor';

Meteor.methods({
	
	//simple search function: retrieves the list of items matching the word(s)
	getSimpleSearch: function (searchValue) {
		console.log("Searching for ", searchValue);
		
		var convertAsyncToSync  = Meteor.wrapAsync( HTTP.get ),
        result = convertAsyncToSync( 'https://api-na.hosted.exlibrisgroup.com/primo/v1/pnxs?vid=UNIBZ&scope=All&q=any,contains,'+searchValue+'&apikey=l7xx53f22519810d4f56a21caceb0fc95de4', {} );
    	console.log("Simple Search Complete");
        return result.data.docs;
	},

	//advanced search function: retrieves results filtered by various parameters
	getAdvancedResults: function (scopeOne,categoryOne,searchValueOne) {
		console.log("Searching for ", scopeOne+"__"+categoryOne+"__"+searchValueOne);

		var convertAsyncToSync  = Meteor.wrapAsync( HTTP.get ),
        result = convertAsyncToSync( 'https://api-na.hosted.exlibrisgroup.com/primo/v1/pnxs?vid=UNIBZ&scope=All&q='+scopeOne+','+categoryOne+','+searchValueOne+',&apikey=l7xx53f22519810d4f56a21caceb0fc95de4', {} );
    	console.log("Advanced Search Complete");
        return result.data.docs;
	}
});