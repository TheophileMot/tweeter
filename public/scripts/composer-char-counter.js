function updateCounter($textarea) {
  let counter = $textarea.siblings('.counter');
  counter.text(140 - $textarea.val().length);
  counter.removeClass('almost-too-long too-long way-too-long');
  if ($textarea.val().length >= 160) {
    counter.addClass('way-too-long');
  } else if ($textarea.val().length > 140) {
    counter.addClass('too-long');
  } else if ($textarea.val().length === 140) {
    counter.addClass('almost-too-long');
  }
}

function validateTweet(tweet, callback) {
  if (!tweet.length) {
    callback('Your message cannot be empty.');
  } else if (tweet.length > 200) {
    callback('Your message is WAY too long.');
  } else if (tweet.length > 140) {
    callback('Your message is too long.');
  } else {
    callback(null);
  }
}

function postNewTweet($parent, $textarea) {
  validateTweet($textarea.val(), (err) => {
    if (err) {
      let $errorMsg = createErrorMessage(err);
      $('.new-tweet .error-wrapper').append($errorMsg);
      $errorMsg.fadeOut(3000, function() { this.remove(); });
      $errorMsg.addClass('float-away');
    } else {
      // post and clear form
      let postField = $parent.serialize();
      $textarea.val('');
      updateCounter($textarea);
      $.post('/tweets/', postField)
        .done(loadTweets());
    }
  });
}

$(document).ready(function() {
  let $textarea = $('.new-tweet form textarea');

  $textarea.keyup(function(event) {
    updateCounter($(this));
  });

  // enter key will submit tweet instead of adding a line break;
  // meta+r triggers ROT13
  $textarea.keypress(function(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      let $composeForm = $('.new-tweet form');
      postNewTweet($composeForm, $composeForm.children('textarea'));
    } else if (event.key === 'r' && event.metaKey) {
      event.preventDefault();
      $textarea.val(rot13($textarea.val()));
    }
  });

  updateCounter($textarea);
});