import {extend} from 'flarum/extend';
import app from 'flarum/app';
import PostStream from 'flarum/components/PostStream';
import Readers from './components/Readers';

const translationPrefix = 'clarkwinkelmann-who-read.forum.';

export default function () {
    extend(PostStream.prototype, 'view', function (vnode) {
        let readers = this.discussion.clarkwinkelmannWhoReaders();

        // If there are no readers or if we can't see them, skip
        if (!readers) {
            return;
        }

        vnode.children.forEach(item => {
            if (app.forum.attribute('who-read.showBetweenPosts') && item.attrs && item.attrs['data-id']) {
                const post = app.store.getById('posts', item.attrs['data-id']);

                // Separate the readers into two arrays.
                // Those who read this post stay in the original array, they will be shown below.
                // Those who did not read go in the new array, they will be shown above the post.
                const readersWhoDidntReadThisPost = [];
                readers = readers.filter(reader => {
                    const hasReadThePost = reader.last_read_post_number() >= post.number();

                    if (!hasReadThePost) {
                        readersWhoDidntReadThisPost.push(reader);
                    }

                    return hasReadThePost;
                });

                // If this is the first post of the visible section, we won't show read status
                // If we showed it, it would show everyone who didn't read up to here together, even if they stopped reading many pages away
                // The check is done after we extract readers, that way those readers of previous pages are removed and won't show up
                if (this.discussion.postIds()[this.visibleStart] === item.attrs['data-id']) {
                    return;
                }

                if (readersWhoDidntReadThisPost.length) {
                    item.children.unshift(Readers.component({
                        readers: readersWhoDidntReadThisPost,
                        extended: true,
                        title: app.translator.trans(translationPrefix + 'stats.to_at_least_here', {
                            count: readersWhoDidntReadThisPost.length + readers.length,
                        }),
                        toggleable: true,
                    }));
                }
            }

            // Insert remaining readers above the reply box
            if (item.attrs && item.attrs.key === 'reply') {
                // We don't re-use the readers array because it won't be filtered if between-post is disabled
                // Best to make a clean filtering anyway to prevent any issue with pagination as well
                const readersWhoReadEverything = this.discussion.clarkwinkelmannWhoReaders().filter(reader => reader.last_read_post_number() >= this.discussion.lastPostNumber());

                if (readersWhoReadEverything.length > 0) {
                    item.children.unshift(Readers.component({
                        readers: readersWhoReadEverything,
                        extended: true,
                        title: app.translator.trans(translationPrefix + 'stats.to_end', {
                            count: readersWhoReadEverything.length,
                        }),
                        unreadControlDiscussion: this.discussion,
                    }));
                }
            }
        });
    });
}
