# Who read

[![MIT license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/clarkwinkelmann/flarum-ext-who-read/blob/master/LICENSE.md) [![Latest Stable Version](https://img.shields.io/packagist/v/clarkwinkelmann/flarum-ext-who-read.svg)](https://packagist.org/packages/clarkwinkelmann/flarum-ext-who-read) [![Total Downloads](https://img.shields.io/packagist/dt/clarkwinkelmann/flarum-ext-who-read.svg)](https://packagist.org/packages/clarkwinkelmann/flarum-ext-who-read) [![Donate](https://img.shields.io/badge/paypal-donate-yellow.svg)](https://www.paypal.me/clarkwinkelmann)

Make read status visible to selected groups.

Use cases: show which moderators have read what, show instant-messaging-like read status for small communities.

This extension directly pulls data from the the table used by Flarum read status.

Customize who can SEE via the Permissions tab.

Customize who can be SEEN via the settings modal.

Users with the SEE permission can see the last read time and post number of every SEEN user.

Optionally the subscription status can be made visible as well.

In the Settings modal, you can choose where the read status is visible: discussion list, discussion header, and under each post.

Users with the UNREAD permission can set their own read status to unread.
Their avatar will appear greyed out with an unread indicator.
The unread toggle is accessible in the discussion controls, and beside the read status of the last post.

Please note that information about each individual reader is loaded for every discussion.
If you decide to show the read status of all members on a large forum, performance might be impacted.

## Installation

    composer require clarkwinkelmann/flarum-ext-who-read

## Links

- [GitHub](https://github.com/clarkwinkelmann/flarum-ext-who-read)
- [Packagist](https://packagist.org/packages/clarkwinkelmann/flarum-ext-who-read)
- [Discuss](https://discuss.flarum.org/d/23066)

The initial version of this extension has been sponsored by [FibraClick Forum](https://forum.fibra.click).
