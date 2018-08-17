# Tweeter Project

Tweeter is a simple, single-page Twitter clone. In its current demo state, user names are randomly generated; ultimately, of course, it would allow users to register and log in / out.

## Features

The app captures key presses in the 'new tweet' form to update a 'characters remaining' counter, to submit the tweet on Enter, and to obfuscate or deobfuscate using ROT13 on ⌘R (this overrides any default browser action, e.g., 'refresh page' in Firefox). ROT13 is currently implemented for English and Russian alphabets; in the latter case, since Russian has an odd number (33) of letters in the alphabet, ё has been left out of the transformation.

If a user submits an invalid tweet (i.e., empty or too long), an error message appears and fades away after a few seconds.

The form can be hidden or revealed using the 'Compose' button in the top right.

By default, the list of tweets shows the 10 latest tweets; it is updated every 30 seconds, whenever the user submits a new tweet, and whenever the user changes the custom filter.

The custom filter input at the top of the page allows the user to enter a regular expression; only the latest ten tweets matching the expression will be shown. If it is not a valid regular expression, the filter is not applied.

The user can ROT13 any tweet by clicking on the 'recycle' icon at the bottom right of the message. This is accompanied by an animation that spins the text and flips the user name upside down.

## Future work

- register; log in / out
- functional 'flag' and 'like' buttons
- ROT13 for more alphabets
- the regular expression input should indicate whether the expression is valid or not (e.g., by making the background of the input form red)
- other custom filters, e.g., by date, user, etc.

## Design issues
- the filter and compose sections scroll with the page; it might better to have them fixed in place
- the user avatars are laid over the title bar as they scroll up: this could be seen as a bug (easily fixed) or a feature

## Dependencies

- Express
- Node
- body-parser
- chance (for randomly-generated user names)
- md5
- mongodb