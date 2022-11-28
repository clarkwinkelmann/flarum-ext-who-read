import {extend} from 'flarum/common/extend';
import app from 'flarum/forum/app';
import Button from 'flarum/common/components/Button';
import Discussion from 'flarum/common/models/Discussion';
import DiscussionHero from 'flarum/forum/components/DiscussionHero';
import AvatarSummary from './components/AvatarSummary';
import ReadersModal from './components/ReadersModal';
import filterVeryBehind from './utils/filterVeryBehind';
import normalizePostNumber from './utils/normalizePostNumber';
import normalizeReadersRelationship from './utils/normalizeReadersRelationship';

export default function () {
    extend(DiscussionHero.prototype, 'items', function (items) {
        if (!app.forum.attribute('who-read.showInHero')) {
            return;
        }

        const discussion: Discussion = (this.attrs as any).discussion;

        const readers = filterVeryBehind(normalizeReadersRelationship(discussion.clarkwinkelmannWhoReaders()), discussion);

        if (readers.length === 0) {
            return;
        }

        items.add('who-read', Button.component({
            className: 'Button Button--link',
            onclick: (event: Event) => {
                event.preventDefault();

                app.modal.show(ReadersModal, {
                    readersEnd: readers.filter(
                        reader => normalizePostNumber(reader.last_read_post_number()) >= normalizePostNumber(discussion.lastPostNumber())
                    ),
                    readersBehind: readers.filter(
                        reader => normalizePostNumber(reader.last_read_post_number()) < normalizePostNumber(discussion.lastPostNumber())
                    ),
                });
            },
        }, m(AvatarSummary, {
            readers,
            discussion,
            extendable: true,
        })));
    });
}
