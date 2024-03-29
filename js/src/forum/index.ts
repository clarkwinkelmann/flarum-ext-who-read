import {extend} from 'flarum/common/extend';
import app from 'flarum/forum/app';
import DiscussionListState from 'flarum/forum/states/DiscussionListState';
import Discussion from 'flarum/common/models/Discussion';
import Badge from 'flarum/common/components/Badge';
import Model from 'flarum/common/Model';
import UserState from './models/UserState';
import addInDiscussionHero from './addInDiscussionHero';
import addInDiscussionList from './addInDiscussionList';
import addInPostStream from './addInPostStream';
import addUnreadControls from './addUnreadControls';

app.initializers.add('clarkwinkelmann-who-read', () => {
    app.store.models['clarkwinkelmann-who-readers'] = UserState;
    Discussion.prototype.clarkwinkelmannWhoReaders = Discussion.hasMany('clarkwinkelmannWhoReaders');

    extend(Discussion.prototype, 'badges', function (items) {
        if (this.attribute('whoReadUnread')) {
            items.add('who-read-unread', Badge.component({
                type: 'who-read-unread',
                icon: app.forum.attribute('who-read.unreadIcon'),
                label: app.translator.trans('clarkwinkelmann-who-read.forum.badges.unread'),
            }));
        }
    });

    // When Flarum sets the last read post in DiscussionPage.positionChanged, we want to trigger a redraw after the request finishes
    extend(Model.prototype, 'save', function (promise, attributes) {
        if (attributes.lastReadPostNumber) {
            promise.then(() => {
                m.redraw();
            });
        }
    });

    extend(DiscussionListState.prototype, 'requestParams', function (params) {
        if (!app.forum.attribute('who-read.canSee')) {
            return;
        }

        if (!Array.isArray(params.include)) {
            return;
        }

        params.include.push('clarkwinkelmannWhoReaders.user.groups');
    });

    addInDiscussionHero();
    addInDiscussionList();
    addInPostStream();
    addUnreadControls();
});
