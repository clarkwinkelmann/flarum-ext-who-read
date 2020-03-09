import app from 'flarum/app';
import Component from 'flarum/Component';
import avatar from 'flarum/helpers/avatar';
import listItems from 'flarum/helpers/listItems';
import extractText from 'flarum/utils/extractText';
import humanTime from 'flarum/utils/humanTime';
import ItemList from 'flarum/utils/ItemList';
import appendReaderBadges from '../utils/appendReaderBadges';

/* global m, $ */

const translationPrefix = 'clarkwinkelmann-who-read.forum.';

export default class Readers extends Component {
    view() {
        const LIMIT = app.forum.attribute('who-read.maxVisible');

        return m('ul.WhoRead-list.WhoRead-summary', this.props.readers.map((reader, index) => {
            if (!this.showAll) {
                if (index === LIMIT) {
                    const howManyMore = this.props.readers.length - LIMIT;

                    return m('span.Avatar.WhoRead-more', {
                        // Not using a tooltip here because it kind of breaks if a tooltip is open while Mithril redraws
                        title: extractText(app.translator.trans(translationPrefix + 'more.' + (this.props.extendable ? 'show' : 'info'), {
                            count: howManyMore,
                        })),
                        onclick: event => {
                            if (this.props.extendable) {
                                event.stopPropagation();
                                this.showAll = true;
                            }
                        },
                    }, '+' + howManyMore);
                }

                if (index >= LIMIT) {
                    return null;
                }
            }

            const user = reader.user();

            // Most likely this shouldn't happen, unless the database integrity is broken
            if (!user) {
                return null;
            }

            const badges = new ItemList();

            appendReaderBadges(badges, reader);

            const outdated = reader.unread() || (this.props.discussion && reader.last_read_post_number() < this.props.discussion.lastPostNumber());

            let toolTipTranslationKey = 'last-read-at';

            if (this.props.discussion) {
                toolTipTranslationKey = outdated ? 'last-read-at-behind' : 'last-read-at-up-to-date';
            }

            return m('li.WhoRead-item', m('span', {
                title: extractText(app.translator.trans(translationPrefix + 'tooltip.' + toolTipTranslationKey, {
                    user,
                    ago: humanTime(reader.last_read_at()),
                })),
                config(element) {
                    $(element).tooltip({placement: 'top'});
                },
            }, [
                m('.WhoRead-avatar', {
                    className: outdated ? 'WhoRead-avatar--outdated' : '',
                }, [
                    avatar(user),
                    m('ul.badges', listItems(badges.toArray())),
                ]),
            ]));
        }));
    }
}
