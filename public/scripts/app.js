/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

function isValidLength($textarea) {
  return $textarea.val().length > 0 && $textarea.val().length <= 140;
}

function createErrorMessage(msg) {
  return $('<p>').addClass('errorMsg').text(msg);
}

function postNewTweet($parent, $textarea) {
  // don't do anything if form is empty or too long
  if (!isValidLength($textarea)) {
    let $errorMsg = createErrorMessage('Sorry, that\'s invalid!');
    $('.new-tweet h2').prepend($errorMsg);
    return;
  } else {
    // post and clear form
    let postField = $parent.serialize();
    $.post('/tweets/', postField);
    $textarea.val('');
    updateCounter($textarea);
  }
}

function howLongAgo(creationDate) {
  let timeDiff = new Date() - creationDate;
  return (timeDiff / (365 * 24 * 60 * 60 * 1000)).toPrecision(3) + ' years ago';
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
  let $footer_span_date = $('<span>').addClass('date').text(howLongAgo(tweet.createdAt));
  let $footer_span_icons = $('<span>').addClass('icons');
  $footer_span_icons.append('<i class="fas fa-flag"></i> <i class="fas fa-recycle"></i> <i class="fas fa-heart"></i>');
  $footer.append($footer_span_date, $footer_span_icons);

  let $img = $('<img>');
  $img.addClass('avatar');

  $tweet.append($header, $message, $footer);

  return $tweet;
}

function renderTweets(tweets) {
  tweets.forEach( tweet => $('section.tweet-list').append(createTweetElement(tweet)) );
}

function loadTweets(callback) {
  return $.get('/tweets/')
    .then( function(data) {
      callback(data);
    });
}


$(document).ready(function() {
  let $composeForm = $('.new-tweet form');
  $composeForm.submit(function(event) {
    event.preventDefault();
    postNewTweet($(this), $(this).children('textarea'));
  });

  loadTweets( tweetData => renderTweets(tweetData) );
});