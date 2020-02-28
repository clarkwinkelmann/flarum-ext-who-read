import {extend} from 'flarum/extend';
import app from 'flarum/app';
import DiscussionPage from 'flarum/components/DiscussionPage';
import Discussion from 'flarum/models/Discussion';
import UserState from './models/UserState';
import addInDiscussionHero from './addInDiscussionHero';
import addInDiscussionList from './addInDiscussionList';
import addInPostStream from './addInPostStream';

app.initializers.add('clarkwinkelmann-who-read', () => {
    app.store.models['clarkwinkelmann-who-readers'] = UserState;
    Discussion.prototype.clarkwinkelmannWhoReaders = Discussion.hasMany('clarkwinkelmannWhoReaders');

    // Doing this here because it's used by both DiscussionHero and PostStream
    extend(DiscussionPage.prototype, 'params', function (params) {
        if (!app.forum.attribute('who-read.canSee')) {
            return;
        }

        params.include.push('clarkwinkelmannWhoReaders.user.groups');
    });

    addInDiscussionHero();
    addInDiscussionList();
    addInPostStream();
});
