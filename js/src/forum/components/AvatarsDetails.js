import app from 'flarum/forum/app';
import Link from 'flarum/common/components/Link';
import Tooltip from 'flarum/common/components/Tooltip';
import avatar from 'flarum/common/helpers/avatar';
import listItems from 'flarum/common/helpers/listItems';
import username from 'flarum/common/helpers/username';
import userOnline from 'flarum/common/helpers/userOnline';
import extractText from 'flarum/common/utils/extractText';
import humanTime from 'flarum/common/utils/humanTime';
import appendReaderBadges from '../utils/appendReaderBadges';

/* global m, $ */

export default class AvatarsDetails {
    view(vnode) {
        return m('ul.WhoRead-list.WhoRead-details', vnode.attrs.readers.map(reader => {
            const user = reader.user();

            // Most likely this shouldn't happen, unless the database integrity is broken
            if (!user) {
                return null;
            }

            const badges = user.badges();

            appendReaderBadges(badges, reader);

            return m('li.WhoRead-item', m(Tooltip, {
                text: extractText(app.translator.trans('clarkwinkelmann-who-read.forum.tooltip.last-read-at', {
                    user,
                    ago: humanTime(reader.last_read_at()),
                })),
            }, m(Link, {
                href: app.route.user(user),
                'data-container': 'body', // Bootstrap tooltip option so we overflow .Modal edge
            }, [
                m('.WhoRead-avatar', [
                    avatar(user),
                    m('ul.badges', listItems(badges.toArray())),
                ]),
                m('.WhoRead-user', [
                    userOnline(user),
                    username(user),
                ]),
            ])));
        }));
    }
}
