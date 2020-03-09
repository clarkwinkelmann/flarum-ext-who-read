import app from 'flarum/app';
import Badge from 'flarum/components/Badge';

/* global m, $ */

export default function (badges, reader) {
    if (flarum.extensions['flarum-subscriptions']) {
        switch (reader.subscription()) {
            case 'follow':
                badges.add('subscriptions-follow', Badge.component({
                    label: app.translator.trans('flarum-subscriptions.forum.badge.following_tooltip'),
                    icon: 'fas fa-star',
                    type: 'following',
                }));
                break;
            case 'ignore':
                badges.add('subscriptions-ignoring', Badge.component({
                    label: app.translator.trans('flarum-subscriptions.forum.badge.ignoring_tooltip'),
                    icon: 'far fa-eye-slash',
                    type: 'ignoring',
                }));
                break;
        }
    }

    if (reader.unread()) {
        badges.add('who-read-unread', Badge.component({
            type: 'who-read-unread',
            icon: 'fas fa-eye-slash',
            label: app.translator.trans('clarkwinkelmann-who-read.forum.badges.unread'),
        }));
    }
}
