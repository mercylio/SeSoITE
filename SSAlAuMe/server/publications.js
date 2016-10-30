Meteor.publish('messages', function(skipCount) {
  /*
	Meteor._sleepForMs(1000);
  var positiveIntegerCheck = Match.Where(function(x) {
    check(x, Match.Integer);
    return x >= 0;
  });
  check(skipCount, positiveIntegerCheck);
  */
  
  Counts.publish(this, 'messagesCount', Messages.find(),{
  	noReady: true
  });

  return Messages.find({}, {
    limit: parseInt(Meteor.settings.public.recordsPerPage), // records to show per page
    skip: skipCount
  });
});