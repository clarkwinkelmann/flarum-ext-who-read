import app from 'flarum/forum/app';
import Discussion from 'flarum/common/models/Discussion';
import UserState from '../models/UserState';
import normalizePostNumber from './normalizePostNumber';

export default function (readers: UserState[], discussion: Discussion): UserState[] {
    return readers.filter(reader => {
        // The last post number might be null if the user marked as unread. In this case we hide them
        if (reader.last_read_post_number() === null) {
            return false;
        }

        const behindThreshold = app.forum.attribute<number>('who-read.hideWhenBehind');

        if (!behindThreshold) {
            return true;
        }

        return normalizePostNumber(reader.last_read_post_number()) > normalizePostNumber(discussion.lastPostNumber()) - behindThreshold;
    });
}
