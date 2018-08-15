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

function isValidLength($textarea) {
  return $textarea.val().length > 0 && $textarea.val().length <= 140;
}

function postNewTweet($parent, $textarea) {
  // don't do anything if form is empty or too long
  if (!isValidLength($textarea)) {
    let $errorMsg = createErrorMessage('Sorry, that\'s invalid!');
    $('.new-tweet h2').prepend($errorMsg);
    //$errorMsg.addClass('goAway');
    return;
  } else {
    // post and clear form
    let postField = $parent.serialize();
    $.post('/tweets/', postField);
    $textarea.val('');
    updateCounter($textarea);
  }
}

$(document).ready(function() {
  $('.new-tweet form textarea').keyup(function(event) {
    updateCounter($(this));
  });
});