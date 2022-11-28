import {extend} from 'flarum/common/extend';
import app from 'flarum/forum/app';
import DiscussionList from 'flarum/forum/components/DiscussionList';
import DiscussionListItem from 'flarum/forum/components/DiscussionListItem';
import AvatarSummary from './components/AvatarSummary';
import filterVeryBehind from './utils/filterVeryBehind';

export default function () {
    extend(DiscussionList.prototype, 'requestParams' as any, function (params: any) {
        if (!app.forum.attribute('who-read.showInDiscussionList')) {
            return;
        }

        params.include.push('clarkwinkelmannWhoReaders.user.groups');
    });

    extend(DiscussionListItem.prototype, 'infoItems', function (items) {
        if (!app.forum.attribute('who-read.showInDiscussionList')) {
            return;
        }

        const {discussion} = this.attrs;

        let readers = discussion.clarkwinkelmannWhoReaders();

        if (!readers) {
            return;
        }

        readers = filterVeryBehind(readers, discussion);

        if (readers.length) {
            items.add('who-read', m(AvatarSummary, {
                readers,
                discussion,
            }), -120);
        }
    });
}
