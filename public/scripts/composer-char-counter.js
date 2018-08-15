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
      $('.new-tweet h2').prepend($errorMsg);
    } else {
      // post and clear form
      let postField = $parent.serialize();
      $.post('/tweets/', postField);
      $textarea.val('');
      updateCounter($textarea);
    }
  });
}

$(document).ready(function() {
  $('.new-tweet form textarea').keyup(function(event) {
    updateCounter($(this));
  });
});