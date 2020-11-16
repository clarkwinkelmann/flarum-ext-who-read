import {extend} from 'flarum/extend';
import app from 'flarum/app';
import Button from 'flarum/components/Button';
import CommentPost from 'flarum/components/CommentPost';
import Post from 'flarum/components/Post';
import icon from 'flarum/helpers/icon';
import extractText from 'flarum/utils/extractText';
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
            () => this.attrs.post.discussion().lastReadPostNumber()
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

                    let title = extractText(app.translator.transChoice(translationPrefix + 'read-this-post', totalReadersWhoHaveSeenThisPost, {
                        count: totalReadersWhoHaveSeenThisPost,
                    }));

                    if (totalReadersWhoHaveSeenThisPost > 0) {
                        title += '. ' + extractText(app.translator.transChoice(translationPrefix + 'read-no-further', readersUntilHereOnly.length, {
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
                    title: extractText(app.translator.transChoice(translationPrefix + 'read-to-end', readersEnd.length, {
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
