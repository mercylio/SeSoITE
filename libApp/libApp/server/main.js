import { Meteor } from 'meteor/meteor';

Meteor.methods({
	
	getSimpleSearch: function (searchValue) {
		console.log("Searching for ", searchValue);
		
		var convertAsyncToSync  = Meteor.wrapAsync( HTTP.get ),
        result = convertAsyncToSync( 'https://api-na.hosted.exlibrisgroup.com/primo/v1/pnxs?vid=UNIBZ&scope=All&q=any,contains,'+searchValue+'&apikey=l7xx53f22519810d4f56a21caceb0fc95de4', {} );
    //    result = convertAsyncToSync( 'https://api-na.hosted.exlibrisgroup.com/primo/v1/pnxs?vid=UNIBZ&scope=All&q=any,contains,Hello&apikey=l7xx53f22519810d4f56a21caceb0fc95de4', {} );
    //    console.log(result.data.docs[0]);
    	console.log("Simple Search Complete");
        return result.data.docs;
	},

	getAdvancedResults: function (scopeOne,categoryOne,searchValueOne) { /* (scopeOne,scopeTwo,categoryOne,categoryTwo,condition,searchValueOne,searchValueTwo) { */
		console.log("Searching for ", scopeOne+"__"+categoryOne+"__"+searchValueOne/*+"_"+searchValueTwo*/);
		 
		var convertAsyncToSync  = Meteor.wrapAsync( HTTP.get ),
        result = convertAsyncToSync( 'https://api-na.hosted.exlibrisgroup.com/primo/v1/pnxs?vid=UNIBZ&scope=All&q='+scopeOne+/*any*/','+categoryOne+/*contains*/','+searchValueOne+/*'&boolOperator='+condition+','+scopeTwo+','+categoryTwo+','+searchValueTwo+*/'&apikey=l7xx53f22519810d4f56a21caceb0fc95de4', {} );
    //    result = convertAsyncToSync( 'https://api-na.hosted.exlibrisgroup.com/primo/v1/pnxs?vid=UNIBZ&scope=All&q=any,contains,Hello&apikey=l7xx53f22519810d4f56a21caceb0fc95de4', {} );
    //    console.log(result.data.docs[0]);
    	console.log("Advanced Search Complete");
        return result.data.docs;
	}

});


//Meteor.http.call("GET","https://api-na.hosted.exlibrisgroup.com/primo/v1/pnxs?vid=UNIBZ&scope=All&q=any,contains,Hello&apikey=XXXXX",function(error,result){
//        console.log(result.data.docs[0]);
//        //return result.data.docs[0];
//    });