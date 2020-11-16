import {extend} from 'flarum/extend';
import app from 'flarum/app';
import DiscussionList from 'flarum/components/DiscussionList';
import DiscussionListItem from 'flarum/components/DiscussionListItem';
import AvatarSummary from './components/AvatarSummary';
import filterVeryBehind from './utils/filterVeryBehind';

/* global m */

export default function () {
    extend(DiscussionList.prototype, 'requestParams', function (params) {
        if (!app.forum.attribute('who-read.showInDiscussionList')) {
            return;
        }

        params.include.push('clarkwinkelmannWhoReaders.user.groups');
    });

    extend(DiscussionListItem.prototype, 'infoItems', function (items) {
        if (!app.forum.attribute('who-read.showInDiscussionList')) {
            return;
        }

        const {discussion} = this.attrs;

        let readers = discussion.clarkwinkelmannWhoReaders();

        if (!readers) {
            return;
        }

        readers = filterVeryBehind(readers, discussion);

        if (readers.length) {
            items.add('who-read', m(AvatarSummary, {
                readers,
                discussion,
            }), -120);
        }
    });
}
