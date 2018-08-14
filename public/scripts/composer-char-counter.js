$(document).ready(function() {
  $('.new-tweet form textarea').keyup(function(event) {
    let $textarea = $(this);

    let counter = $textarea.siblings('.counter');
    counter.text(140 - $textarea.val().length);
    console.log(counter.attr('class').toString().split(' '));
    counter.removeClass('almost-too-long too-long way-too-long');
    if ($textarea.val().length >= 160) {
      counter.addClass('way-too-long');
    } else if ($textarea.val().length > 140) {
      counter.addClass('too-long');
    } else if ($textarea.val().length === 140) {
      counter.addClass('almost-too-long');
    }
  });
});