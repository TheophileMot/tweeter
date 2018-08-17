function filterByUserFilter(tweet) {
  let $userFilter = $('.filter-tweets #user-filter');
  let regex;
  try {
    regex = new RegExp($userFilter.val());
  } catch(err) {
    regex = /.*/;
  }

  let message = tweet.content.text;

  return (message.match(regex) !== null);
}

// when DOM loads, set up triggers for key up
$(document).ready(function() {
  let $userFilter = $('.filter-tweets #user-filter');

  // if any key is pressed in text area, reload tweets according to filter
  $userFilter.keyup(function(event) {
    loadTweets();
  });
});