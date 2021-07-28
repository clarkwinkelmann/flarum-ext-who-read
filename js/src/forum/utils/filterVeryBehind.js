import app from 'flarum/forum/app';

export default function (readers, discussion) {
    return readers.filter(reader => {
        // The last post number might be null if the user marked as unread. In this case we hide them
        if (reader.last_read_post_number() === null) {
            return false;
        }

        const behindTreshold = app.forum.attribute('who-read.hideWhenBehind');

        if (!behindTreshold) {
            return true;
        }

        return reader.last_read_post_number() > discussion.lastPostNumber() - behindTreshold;
    });
}
