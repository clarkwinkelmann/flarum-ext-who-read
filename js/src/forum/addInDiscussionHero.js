import {extend} from 'flarum/common/extend';
import app from 'flarum/forum/app';
import Button from 'flarum/common/components/Button';
import DiscussionHero from 'flarum/forum/components/DiscussionHero';
import AvatarSummary from './components/AvatarSummary';
import ReadersModal from './components/ReadersModal';
import filterVeryBehind from './utils/filterVeryBehind';

/* global m */

export default function () {
    extend(DiscussionHero.prototype, 'items', function (items) {
        if (!app.forum.attribute('who-read.showInHero')) {
            return;
        }

        const {discussion} = this.attrs;

        let readers = discussion.clarkwinkelmannWhoReaders();

        if (!readers) {
            return;
        }

        readers = filterVeryBehind(readers, discussion);

        if (readers.length) {
            items.add('who-read', Button.component({
                className: 'Button Button--link',
                onclick: event => {
                    event.preventDefault();

                    app.modal.show(ReadersModal, {
                        readersEnd: readers.filter(
                            reader => reader.last_read_post_number() >= discussion.lastPostNumber()
                        ),
                        readersBehind: readers.filter(
                            reader => reader.last_read_post_number() < discussion.lastPostNumber()
                        ),
                    });
                },
            }, m(AvatarSummary, {
                readers,
                discussion,
                extendable: true,
            })));
        }
    });
}
