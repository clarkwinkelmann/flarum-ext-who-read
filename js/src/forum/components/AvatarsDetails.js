import app from 'flarum/app';
import Component from 'flarum/Component';
import Link from 'flarum/components/Link';
import avatar from 'flarum/helpers/avatar';
import listItems from 'flarum/helpers/listItems';
import username from 'flarum/helpers/username';
import userOnline from 'flarum/helpers/userOnline';
import extractText from 'flarum/utils/extractText';
import humanTime from 'flarum/utils/humanTime';
import appendReaderBadges from '../utils/appendReaderBadges';

/* global m, $ */

export default class AvatarsDetails extends Component {
    view() {
        return m('ul.WhoRead-list.WhoRead-details', this.props.readers.map(reader => {
            const user = reader.user();

            // Most likely this shouldn't happen, unless the database integrity is broken
            if (!user) {
                return null;
            }

            const badges = user.badges();

            appendReaderBadges(badges, reader);

            return m('li.WhoRead-item', m(Link, {
                href: app.route.user(user),
                title: extractText(app.translator.trans('clarkwinkelmann-who-read.forum.tooltip.last-read-at', {
                    user,
                    ago: humanTime(reader.last_read_at()),
                })),
                oncreate(vnode) {
                    $(vnode.dom).tooltip({
                        placement: 'top',
                        viewport: {
                            selector: '.Modal',
                            padding: 10,
                        },
                    });
                },
            }, [
                m('.WhoRead-avatar', [
                    avatar(user),
                    m('ul.badges', listItems(badges.toArray())),
                ]),
                m('.WhoRead-user', [
                    userOnline(user),
                    username(user),
                ]),
            ]));
        }));
    }
}
