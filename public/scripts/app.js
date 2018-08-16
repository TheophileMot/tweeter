/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

function createErrorMessage(msg) {
  return $('<p>').addClass('error-msg').text(msg);
}

function age(tweet) {
  return new Date() - tweet.createdAt;
}

function howLongAgo(tweet) {
  return (age(tweet) / (365 * 24 * 60 * 60 * 1000)).toPrecision(3) + ' years ago';
}

function createTweetElement(tweet) {
  let $tweet = $('<article>');

  let $header = $('<header>');
  let $header_img_avatar = $('<img>').addClass('avatar').attr('src', tweet.user.avatars.small);
  let $header_h2_username = $('<h2>').addClass('username').text(tweet.user.name);
  let $header_span_handle = $('<span>').addClass('handle').text(tweet.user.handle);
  $header.append($header_img_avatar, $header_h2_username, $header_span_handle);
  
  let $message = $('<div class="message">');
  $message.text(tweet.content.text);

  let $footer = $('<footer>');
  let $footer_span_date = $('<span>').addClass('date').text(howLongAgo(tweet));
  let $footer_span_icons = $('<span>').addClass('icons');
  $footer_span_icons.append('<i class="fas fa-flag"></i> <i class="fas fa-recycle"></i> <i class="fas fa-heart"></i>');
  $footer.append($footer_span_date, $footer_span_icons);

  let $img = $('<img>');
  $img.addClass('avatar');

  $tweet.append($header, $message, $footer);

  return $tweet;
}

// render a tweet or an array of tweets
function renderTweets(tweetData) {
  if (Array.isArray(tweetData)) {
    tweetData.forEach( tweet => renderTweets(tweet) );
  } else {
    $('section.tweet-list').prepend(createTweetElement(tweetData) );
  }
}

function refreshAndRender(tweetData) {
  $('section.tweet-list').text('');
  renderTweets(tweetData);
}

// load up to n tweets and run a callback function on them after an optional filter
//   default callback function clears the tweet container then renders the loaded tweets
function loadTweets(maxTweets = 5, callback = tweetData => refreshAndRender(tweetData), filterFun = () => true) {
  return $.get('/tweets/')
    .done(function(data) {
      callback(data.slice(-maxTweets).filter( d => filterFun(d) ));
    });
}

$(document).ready(function() {
  let $composeForm = $('.new-tweet form');
  $composeForm.submit(function(event) {
    event.preventDefault();
    postNewTweet($(this), $(this).children('textarea'));
  });

  $('#nav-bar .button').on('click', function() {
    $('main .new-tweet').slideToggle(200, () => $('main .new-tweet textarea').focus());
  });

  loadTweets();
});