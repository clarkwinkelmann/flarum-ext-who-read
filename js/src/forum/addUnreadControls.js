import {extend} from 'flarum/extend';
import DiscussionControls from 'flarum/utils/DiscussionControls';
import UnreadButton from './components/UnreadButton';

export default function () {
    extend(DiscussionControls, 'userControls', (items, discussion) => {
        if (!discussion.attribute('whoReadCanMarkUnread')) {
            return;
        }

        items.add('who-read-unread', UnreadButton.component({
            discussion,
        }));
    });
}
