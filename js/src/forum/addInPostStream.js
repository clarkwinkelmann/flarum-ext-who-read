import {extend} from 'flarum/common/extend';
import app from 'flarum/forum/app';
import Button from 'flarum/common/components/Button';
import CommentPost from 'flarum/forum/components/CommentPost';
import Post from 'flarum/forum/components/Post';
import icon from 'flarum/common/helpers/icon';
import extractText from 'flarum/common/utils/extractText';
import AvatarSummary from './components/AvatarSummary';
import ReadersModal from './components/ReadersModal';
import UnreadButton from './components/UnreadButton';

/* global m */

const translationPrefix = 'clarkwinkelmann-who-read.forum.footer.';

export default function () {
    extend(Post.prototype, 'oninit', function () {
        if (!app.forum.attribute('who-read.showBetweenPosts')) {
            return;
        }

        this.subtree.check(
            // Refresh if the user toggles between read and unread
            () => this.attrs.post.discussion().attribute('whoReadUnread'),
            // Make the post redraws when the last read post number changes,
            // so that scrolling through the discussion reflects your own read status
            () => this.attrs.post.discussion().lastReadPostNumber(),
            // Because of some odd magic in Flarum's store, discussion.whoReadUnread and discussion.lastReadPostNumber
            // are actually updated just slightly before the relationship and a redraw triggers in between
            // So this makes the post redraw too early and since the relationship is used to render the avatars
            // and badges they won't be up to date. So we need to use the relationship as source of data as well
            () => JSON.stringify((this.attrs.post.discussion().clarkwinkelmannWhoReaders() || []).map(reader => [
                // The state ID will contain the user ID, so together with the other informations we can be sure it's a different state
                reader.id(),
                // Fixes the unread badge appearing out of sync on the user avatars
                reader.unread(),
                // Fixes the avatars not updating as you scroll
                reader.last_read_post_number(),
            ]))
        );
    });

    // For some reason extending Post is not enough to work for CommentPost. So we also add it to CommentPost
    [Post, CommentPost].forEach(Component => {
        extend(Component.prototype, 'footerItems', function (items) {
            if (!app.forum.attribute('who-read.showBetweenPosts')) {
                return;
            }

            const {post} = this.attrs;
            const discussion = post.discussion();

            // If the post is loaded on a user profile, we don't have access to the list
            // of post IDs in that discussion. If that's the case, skip
            // We can't just check the output of discussion.postIds() because on the
            //  profile page it throws an exception because relationships is undefined
            if (!discussion.data.relationships || !discussion.data.relationships.posts) {
                return;
            }

            const postIds = discussion.postIds();
            const currentPostIndex = postIds.indexOf(post.id());

            if (currentPostIndex !== -1 && currentPostIndex + 1 < postIds.length) {
                const nextPostId = postIds[currentPostIndex + 1];
                const nextPost = app.store.getById('posts', nextPostId);

                if (nextPost) {
                    const readersUntilHereOnly = discussion.clarkwinkelmannWhoReaders().filter(
                        reader => reader.last_read_post_number() >= post.number() && reader.last_read_post_number() < nextPost.number()
                    );

                    const readersFurther = discussion.clarkwinkelmannWhoReaders().filter(
                        reader => reader.last_read_post_number() >= nextPost.number()
                    );

                    const totalReadersWhoHaveSeenThisPost = readersUntilHereOnly.length + readersFurther.length;

                    let title = extractText(app.translator.trans(translationPrefix + 'read-this-post', {
                        count: totalReadersWhoHaveSeenThisPost,
                    }));

                    if (totalReadersWhoHaveSeenThisPost > 0) {
                        title += '. ' + extractText(app.translator.trans(translationPrefix + 'read-no-further', {
                            count: readersUntilHereOnly.length,
                        }));
                    }

                    items.add('who-read', Button.component({
                        className: 'Button Button--link',
                        onclick: event => {
                            event.preventDefault();

                            app.modal.show(ReadersModal, {
                                readersUntilHereOnly,
                                readersFurther,
                            });
                        },
                        title,
                    }, [
                        app.forum.attribute('who-read.showCountOfReadersWhoStopped') ? readersUntilHereOnly.length : totalReadersWhoHaveSeenThisPost,
                        ' ',
                        icon('fas fa-check-double'),
                        ' ',
                        m(AvatarSummary, {
                            readers: readersUntilHereOnly,
                        }),
                    ]));
                }
            } else if (currentPostIndex === postIds.length - 1) {
                // If this is the last post

                const readersEnd = discussion.clarkwinkelmannWhoReaders().filter(
                    reader => reader.last_read_post_number() >= discussion.lastPostNumber()
                );

                items.add('who-read', Button.component({
                    className: 'Button Button--link',
                    onclick: event => {
                        event.preventDefault();

                        app.modal.show(ReadersModal, {
                            readersEnd,
                        });
                    },
                    title: extractText(app.translator.trans(translationPrefix + 'read-to-end', {
                        count: readersEnd.length,
                    })),
                }, [
                    readersEnd.length,
                    ' ',
                    icon('fas fa-check-double'),
                    ' ',
                    m(AvatarSummary, {
                        readers: readersEnd,
                    }),
                ]));

                if (discussion.attribute('whoReadCanMarkUnread')) {
                    items.add('who-read-unread', m(UnreadButton, {
                        className: 'Button',
                        discussion,
                    }));
                }
            }
        });
    });
}
