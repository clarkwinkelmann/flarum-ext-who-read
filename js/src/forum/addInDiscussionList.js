import {extend} from 'flarum/extend';
import app from 'flarum/app';
import DiscussionList from 'flarum/components/DiscussionList';
import DiscussionListItem from 'flarum/components/DiscussionListItem';
import Readers from './components/Readers';

export default function () {
    extend(DiscussionList.prototype, 'requestParams', function (params) {
        if (!app.forum.attribute('who-read.showInDiscussionList')) {
            return;
        }

        params.include.push('clarkwinkelmannWhoReaders.user.groups');
    });

    extend(DiscussionListItem.prototype, 'infoItems', function (items) {
        if (!app.forum.attribute('who-read.showInDiscussionList')) {
            return;
        }

        const readers = this.props.discussion.clarkwinkelmannWhoReaders();

        if (readers && readers.length) {
            items.add('who-read', Readers.component({
                readers,
                discussion: this.props.discussion,
            }), -120);
        }
    });
}
