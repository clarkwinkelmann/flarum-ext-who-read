import {extend} from 'flarum/extend';
import app from 'flarum/app';
import DiscussionList from 'flarum/components/DiscussionList';
import DiscussionListItem from 'flarum/components/DiscussionListItem';
import AvatarSummary from './components/AvatarSummary';
import filterVeryBehind from './utils/filterVeryBehind';

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

        let readers = this.props.discussion.clarkwinkelmannWhoReaders();

        if (!readers) {
            return;
        }

        readers = filterVeryBehind(readers, this.props.discussion);

        if (readers.length) {
            items.add('who-read', AvatarSummary.component({
                readers,
                discussion: this.props.discussion,
            }), -120);
        }
    });
}
