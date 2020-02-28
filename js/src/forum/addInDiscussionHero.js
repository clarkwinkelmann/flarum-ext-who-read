import {extend} from 'flarum/extend';
import app from 'flarum/app';
import DiscussionHero from 'flarum/components/DiscussionHero';
import Readers from './components/Readers';

export default function () {
    extend(DiscussionHero.prototype, 'items', function (items) {
        if (!app.forum.attribute('who-read.showInHero')) {
            return;
        }

        const readers = this.props.discussion.clarkwinkelmannWhoReaders();

        if (readers && readers.length) {
            items.add('who-read', Readers.component({
                readers,
                discussion: this.props.discussion,
                extended: true,
            }), -10);
        }
    });
}
