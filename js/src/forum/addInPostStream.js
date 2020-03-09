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

const translationPrefix = 'clarkwinkelmann-who-read.forum.footer.';

export default function () {
    extend(Post.prototype, 'init', function () {
        this.subtree.check(
            // Refresh if the user toggles between read and unread
            () => this.props.post.discussion().attribute('whoReadUnread'),
            // Make the post redraws when the last read post number changes,
            // so that scrolling through the discussion reflects your own read status
            () => this.props.post.discussion().lastReadPostNumber()
        );
    });

    // For some reason extending Post is not enough to work for CommentPost. So we also add it to CommentPost
    [Post, CommentPost].forEach(Component => {
        extend(Component.prototype, 'footerItems', function (items) {
            const discussion = this.props.post.discussion();

            // If the post is loaded on a user profile, we don't have access to the list
            // of post IDs in that discussion. If that's the case, skip
            // We can't just check the output of discussion.postIds() because on the
            //  profile page it throws an exception because relationships is undefined
            if (!discussion.data.relationships || !discussion.data.relationships.posts) {
                return;
            }

            const postIds = discussion.postIds();
            const currentPostIndex = postIds.indexOf(this.props.post.id());

            if (currentPostIndex !== -1 && currentPostIndex + 1 < postIds.length) {
                const nextPostId = postIds[currentPostIndex + 1];
                const nextPost = app.store.getById('posts', nextPostId);

                if (nextPost) {
                    const readersUntilHereOnly = discussion.clarkwinkelmannWhoReaders().filter(
                        reader => reader.last_read_post_number() >= this.props.post.number() && reader.last_read_post_number() < nextPost.number()
                    );

                    const readersFurther = discussion.clarkwinkelmannWhoReaders().filter(
                        reader => reader.last_read_post_number() >= nextPost.number()
                    );

                    items.add('who-read', Button.component({
                        className: 'Button Button--link',
                        onclick: event => {
                            event.preventDefault();

                            app.modal.show(new ReadersModal({
                                readersUntilHereOnly,
                                readersFurther,
                            }));
                        },
                        title: extractText(app.translator.trans(translationPrefix + 'to-here-' + (readersUntilHereOnly.length ? 'some-stopped' : (readersFurther.length ? 'none-stopped' : 'nobody')), {
                            total: readersUntilHereOnly.length + readersFurther.length,
                            stopped: readersUntilHereOnly.length,
                        })),
                    }, [
                        (readersUntilHereOnly.length + readersFurther.length),
                        ' ',
                        icon('fas fa-check-double'),
                        ' ',
                        AvatarSummary.component({
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

                        app.modal.show(new ReadersModal({
                            readersEnd,
                        }));
                    },
                    title: extractText(app.translator.trans(translationPrefix + 'to-end' + (readersEnd.length ? '' : '-nobody'), {
                        total: readersEnd.length,
                    })),
                }, [
                    readersEnd.length,
                    ' ',
                    icon('fas fa-check-double'),
                    ' ',
                    AvatarSummary.component({
                        readers: readersEnd,
                    }),
                ]));

                if (discussion.attribute('whoReadCanMarkUnread')) {
                    items.add('who-read-unread', UnreadButton.component({
                        className: 'Button',
                        discussion,
                    }));
                }
            }
        });
    });
}
