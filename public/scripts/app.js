/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

function rot13(text) {
  let rotText = text.replace(/[A-Z]/g, c => String.fromCharCode((c.charCodeAt() - 52) % 26 + 65));
  rotText = rotText.replace(/[a-z]/g, c => String.fromCharCode((c.charCodeAt() - 84) % 26 + 97));
  return rotText;
}

function createErrorMessage(msg) {
  return $('<p>').addClass('error-msg').text(msg);
}

function howLongAgo(time) {
  let age = new Date() - time;

  let seconds = age / 1000;
  let minutes = seconds / 60;
  let hours = minutes / 60;
  let days = hours / 24;
  let weeks = days / 7;
  let years = weeks / 52;
  
  let timeSpans = [years, weeks, days, hours, minutes, seconds];
  let timeAbbrs = 'ywdhms';
  for (let i in timeSpans) {
    if (timeSpans[i] > 1) {
      return timeSpans[i].toPrecision(2) + timeAbbrs[i] + ' ago';
    }
  }
  return 'just now';
}

function createTweetElement(tweet) {
  // check whether database object has the right fields
  if (!tweet.user || !tweet.content || !tweet.createdAt) {
    for (let prop of ['user', 'content', 'createdAt']) {
      if (!tweet[prop]) { console.log(`Database error! Property ${prop} missing in db entry ${tweet._id}`); }
    }
    return $('<article>check your database for errors</article>');
  } else {
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

    // set up ROT13 trigger for clicking on flag icon
    let $footer_span_icons_recycle = $('<i>').addClass('fas fa-recycle').click(function() {
      let $message = $(this).parent().parent().siblings('div');
      $message.text(rot13($message.text()));
    });

    $footer_span_icons.append('<i class="fas fa-flag"></i> ');
    $footer_span_icons.append($footer_span_icons_recycle);
    $footer_span_icons.append(' <i class="fas fa-heart"></i>');
    $footer.append($footer_span_date, $footer_span_icons);

    let $img = $('<img>');
    $img.addClass('avatar');

    $tweet.append($header, $message, $footer);

    return $tweet;
  }
}

// render a tweet or an array of tweets
function renderTweets(tweetData) {
  if (Array.isArray(tweetData)) {
    tweetData.forEach( tweet => renderTweets(tweet) );
  } else {
    let $tweetElement = createTweetElement(tweetData);
    if ($tweetElement) {
      $('section.tweet-list').prepend($tweetElement);
    } else {
      $('section.tweet-list').prepend($tweetElement);
      //
    }
  }
}

function refreshAndRender(tweetData) {
  $('section.tweet-list').text('');
  renderTweets(tweetData);
}

// load up to n tweets and run a callback function on them after an optional filter
//   default callback function clears the tweet container then renders the loaded tweets
function loadTweets(maxTweets = 10, callback = tweetData => refreshAndRender(tweetData), filterFun = () => true) {
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

  // capture cut / paste to update character counter
  let $textarea = $('.new-tweet form textarea');
  $textarea.bind('cut', () => setTimeout(() => updateCounter($textarea), 10));
  $textarea.bind('paste', () => setTimeout(() => updateCounter($textarea), 10));

  $('#nav-bar .button').click(() =>
    $('.new-tweet').slideToggle(200, () => $('.new-tweet textarea').focus())
  );

  loadTweets();
});