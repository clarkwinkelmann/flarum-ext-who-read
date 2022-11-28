import app from 'flarum/forum/app';
import Badge from 'flarum/common/components/Badge';
import ItemList from 'flarum/common/utils/ItemList';
import UserState from '../models/UserState';

const translationPrefix = 'clarkwinkelmann-who-read.forum.badges.';

export default function (badges: ItemList<any>, reader: UserState) {
    if (flarum.extensions['flarum-subscriptions']) {
        switch (reader.subscription()) {
            case 'follow':
                badges.add('subscriptions-follow', Badge.component({
                    label: app.translator.trans(translationPrefix + 'following'),
                    icon: 'fas fa-star',
                    type: 'following',
                }));
                break;
            case 'ignore':
                badges.add('subscriptions-ignoring', Badge.component({
                    label: app.translator.trans(translationPrefix + 'ignoring'),
                    icon: 'far fa-eye-slash',
                    type: 'ignoring',
                }));
                break;
        }
    }

    if (reader.unread()) {
        badges.add('who-read-unread', Badge.component({
            type: 'who-read-unread',
            icon: app.forum.attribute('who-read.unreadIcon'),
            label: app.translator.trans(translationPrefix + 'unread'),
        }));
    }
}
