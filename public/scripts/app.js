/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

// ROT13 to obfuscate / deobfuscate text: rotate through half the alphabet
function rot13(text) {
  let rotText  = text.replace(/[a-z]/g, c => 'abcdefghijklmnopqrstuvwxyz'['nopqrstuvwxyzabcdefghijklm'.indexOf(c)]);
  rotText  = rotText.replace(/[а-я]/g, c => 'абвгдежзийклмнопрстуфхцчшщъыьэюя'['рстуфхцчшщъыьэюяабвгдежзийклмноп'.indexOf(c)]);
  rotText  = rotText.replace(/[A-Z]/g, c => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'['NOPQRSTUVWXYZABCDEFGHIJKLM'.indexOf(c)]);
  rotText  = rotText.replace(/[А-Я]/g, c => 'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'['РСТУФХЦЧШЩЪЫЬЭЮЯАБВГДЕЖЗИЙКЛМНОП'.indexOf(c)]);
  
  return rotText;
}

// create DOM element with error message
function createErrorMessage(msg) {
  return $('<p>').addClass('error-msg').text(msg);
}

// simple text for age of message in human-readable format, e.g., '13m ago'
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

// use jQuery to construct tweet
function createTweetElement(tweet) {
  // first check whether database object has the right fields
  // (this is only surface-level; to be safer, we could check for deeper structure,
  //   e.g., tweet.user.avatars.small, etc.)
  if (!tweet.user || !tweet.content || !tweet.createdAt) {
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
      $message.text(rot13($message.text()));
      $message.toggleClass('flipped-360');
      $header_h2_username.toggleClass('flipped-180');
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
    $('section.tweet-list').prepend($tweetElement);
  }
}

// default callback function for loadTweets: clear tweets and render again
function refreshAndRender(tweetData) {
  $('section.tweet-list').text('');
  renderTweets(tweetData);
}

// load all tweets, filter them, and take the latest n; then run a callback function
//   - the default callback function clears the tweet container then renders the loaded tweets;
//   - the default filter looks at the user filter (above the 'compose') section and applies it as
//     a regular expression
function loadTweets(maxTweets = 10, callback = refreshAndRender, filterFun = filterByUserFilter) {
  return $.get('/tweets/')
    .done(function(data) {
      callback(data.filter( d => filterFun(d) ).slice(-maxTweets));
    });
}

// when DOM is ready, set up triggers (see also triggers in composer-char-counter.js and filter-tweets.js):
//   - submit new tweet
//   - cut/paste in new tweet
//   - click on compose button in top right
$(document).ready(function() {
  // new tweet: prevent default form submission; use custom function to post
  let $composeForm = $('.new-tweet form');
  $composeForm.submit(function(event) {
    event.preventDefault();
    postNewTweet($(this), $(this).children('textarea'));
  });

  // capture cut / paste to update character counter
  let $textarea = $('.new-tweet form textarea');
  $textarea.bind('cut', () => setTimeout(() => updateCounter($textarea), 10));
  $textarea.bind('paste', () => setTimeout(() => updateCounter($textarea), 10));

  // click on compose button toggle submission form
  $('#nav-bar .button').click(() =>
    $('.new-tweet').slideToggle(200, () => $('.new-tweet textarea').focus())
  );

  // clear user filter
  let $userFilter = $('.filter-tweets #user-filter');
  $userFilter.val('');

  // load the tweets, and reload every 30s
  loadTweets();
  setInterval(() => loadTweets(), 30 * 1000);
});