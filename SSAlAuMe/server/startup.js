/*Little tips & tricks on retrieval of files inside Mongo Collections:

//find() parses back a "cursor" (a special object containing the 'documents' of the collection & other metadata), which can be used to access more documents
//findOne directly gives you back a document
//find().fetch()[arrayNr].keysearchedfor  using fetch() on the "cursor" gives back all the documents as an array, which is more like findOne()
//e.g.
//Messages.find().fetch()[0].text;
*/
Meteor.startup(function(){
	// if Collection is empty, create a new message. To clean the DB remember: meteor reset (on the terminal)
	if (Messages.find().count() == 0){
		var defaultAuthor = "Anonymus";
		var date = new Date();
		var createdAt = date.toString();
		//var createdAt = date.toISOString().substr(0, 10);
		var defaultTags = ["TAG1","TAG2","TAG3"];
		var defaultText = "Hello world! Let's get some posts on this message board!"
		
		//Messages.insert({author: defaultAuthor, time: createdAt, tags: defaultTags, text: defaultText});
		
		//check on the terminal the messages of our DB
		var randauthor = ["NoOne","H4CK3R","AsdRoflMao","Pig","GorillaScream","MonkeyFace","HotBarbie","GIGANTISCH"];
		var randtags = ["Bla","Bla Bla Bla", "Deadmau5", "Porn", "Disco", "Frank Sinatra", "L33T", "Mega", "TOP", "Summer2016", "WoW", "Raid"];
		var randtext = ["FFS, This is so crazy!!","I can't believe it!","Hey, visit my website: www.unibz.it", "CLOSE DAT FRIDGE!", "Anybody online?", "Looking for group", "HAHAHHAHA", "Banana Muffin is good at 2AM", "No Sleep", "Gosh, this website sucks...", "No, it doesn't", "BEACH, PLEASE!", "XSS HAIUHUIDHAUSHDIUHAUISDIUGAIYSTDIUYAIU", "F+++++++!!!!!!", "Meteor is sooo COOOL!", "=) =) =| =(","No way....","Hello party people! Who wants to join for a dinner at SUSHI all you can eat???","Who wants to play volleyball? Tomorrow, 8PM at Peter Riegler.","Batzen tonight?"];
		

		for(var i = 0;i<101;i++){
			var randAuth = Math.floor(Math.random() * randauthor.length) + 0;
			var nrOfRandTags = Math.floor(Math.random() * randtags.length) + 3;
			var arrayOfRandTags = [];
			for(var j=0;j<nrOfRandTags;j++){
				var randTag = Math.floor(Math.random() * randtags.length) + 0;
				arrayOfRandTags.push(randtags[randTag]);
			}
			arrayOfRandTags.sort();
			
			//CHECK DUPLICATE TAGS
			var cleanTags = arrayOfRandTags.filter(function(elem,pos){
				return arrayOfRandTags.indexOf(elem) == pos;
			});

			
			var randTxt = Math.floor(Math.random() * randtext.length) + 0;
			//console.log(randAuth + " _ " + randTag + " _ " + randTxt);
			var randDate = new Date();
			var currentTime = randDate.toString();
			//var currentTime = randDate.toISOString().substr(0, 10);
			Messages.insert({author: randauthor[randAuth], time: currentTime, tags: cleanTags, text: randtext[randTxt]});
		}

		console.log("Found "+Messages.find().count()+" messages into the Database");
		
		//PRINT THE MESSAGES
		for(i=0;i<Messages.find().count();i++){
			console.log("Message text is: "+Messages.find().fetch()[i].text);
			console.log("Created by: "+Messages.find().fetch()[i].author);
			console.log("At time: "+Messages.find().fetch()[i].time);
			console.log("With tags: "+Messages.find().fetch()[i].tags);
	}

}
});