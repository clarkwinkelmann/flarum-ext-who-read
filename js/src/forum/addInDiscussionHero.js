import {extend} from 'flarum/extend';
import app from 'flarum/app';
import Button from 'flarum/components/Button';
import DiscussionHero from 'flarum/components/DiscussionHero';
import AvatarSummary from './components/AvatarSummary';
import ReadersModal from './components/ReadersModal';
import filterVeryBehind from './utils/filterVeryBehind';

export default function () {
    extend(DiscussionHero.prototype, 'items', function (items) {
        if (!app.forum.attribute('who-read.showInHero')) {
            return;
        }

        let readers = this.props.discussion.clarkwinkelmannWhoReaders();

        if (!readers) {
            return;
        }

        readers = filterVeryBehind(readers, this.props.discussion);

        if (readers.length) {
            items.add('who-read', Button.component({
                className: 'Button Button--link',
                onclick: event => {
                    event.preventDefault();

                    app.modal.show(new ReadersModal({
                        readersEnd: readers.filter(
                            reader => reader.last_read_post_number() >= this.props.discussion.lastPostNumber()
                        ),
                        readersBehind: readers.filter(
                            reader => reader.last_read_post_number() < this.props.discussion.lastPostNumber()
                        ),
                    }));
                },
            }, [
                AvatarSummary.component({
                    readers,
                    discussion: this.props.discussion,
                    extendable: true,
                }),
            ]));
        }
    });
}
