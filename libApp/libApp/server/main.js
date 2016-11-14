import { Meteor } from 'meteor/meteor';
Books = new Mongo.Collection("books");

Meteor.startup( function() {
  // code to run on server at startup

  function seed() {
	if(!Books.findOne({})) {
		Books.insert({title: "To Kill a Mockingbird", value: "To Kill a Mockingbird", author: "Harper Lee"});
    	Books.insert({title: "1984", value:  "1984", author: "George Orwell"});
    	Books.insert({title: "The Lord of the Rings", value: "The Lord of the Rings", author: "J. R. R. Tolkien"});
     	Books.insert({title: "The Catcher in the Rye", value: "The Catcher in the Rye", author: "J. D. Salinger"});
    	Books.insert({title: "The Great Gatsby", value: "The Great Gatsby", author: "F. Scott Fitzgerald"});
	}
}

  Books._ensureIndex({
      "value": "text"
    });
    seed();
});

Meteor.publish("search", function(searchValue) {
	if(!searchValue) {
		return Books.find({});
	}
	console.log("Searching for ", searchValue);
	var cursor = Books.find(
	{ $text: {$search: searchValue}	}, 
	{
		fields: {
			score: { $meta: "textScore"}
		},
		sort: {
			score: { $meta: "textScore"}
		}
	});
	return cursor;
});



