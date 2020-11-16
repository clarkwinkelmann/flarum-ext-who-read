import {extend} from 'flarum/extend';
import DiscussionControls from 'flarum/utils/DiscussionControls';
import UnreadButton from './components/UnreadButton';

/* global m */

export default function () {
    extend(DiscussionControls, 'userControls', (items, discussion) => {
        if (!discussion.attribute('whoReadCanMarkUnread')) {
            return;
        }

        items.add('who-read-unread', m(UnreadButton, {
            discussion,
        }));
    });
}
