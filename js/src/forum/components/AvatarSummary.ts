import {ClassComponent, Vnode} from 'mithril';
import app from 'flarum/forum/app';
import Tooltip from 'flarum/common/components/Tooltip';
import avatar from 'flarum/common/helpers/avatar';
import listItems from 'flarum/common/helpers/listItems';
import extractText from 'flarum/common/utils/extractText';
import humanTime from 'flarum/common/utils/humanTime';
import ItemList from 'flarum/common/utils/ItemList';
import Discussion from 'flarum/common/models/Discussion';
import appendReaderBadges from '../utils/appendReaderBadges';
import UserState from '../models/UserState';
import normalizePostNumber from '../utils/normalizePostNumber';

const translationPrefix = 'clarkwinkelmann-who-read.forum.';

interface AvatarSummaryAttrs {
    readers: UserState[]
    extendable: boolean
    discussion: Discussion
}

export default class AvatarSummary implements ClassComponent<AvatarSummaryAttrs> {
    showAll: boolean = false

    view(vnode: Vnode<AvatarSummaryAttrs>) {
        const LIMIT = app.forum.attribute<number>('who-read.maxVisible');

        const {readers, extendable, discussion} = vnode.attrs;

        return m('ul.WhoRead-list.WhoRead-summary', readers.map((reader, index) => {
            if (!this.showAll) {
                if (index === LIMIT) {
                    const howManyMore = readers.length - LIMIT;

                    return m('span.Avatar.WhoRead-more', {
                        // Not using a tooltip here because it kind of breaks if a tooltip is open while Mithril redraws
                        title: extractText(app.translator.trans(translationPrefix + 'more.' + (extendable ? 'show' : 'info'), {
                            count: howManyMore,
                        })),
                        onclick: (event: Event) => {
                            if (extendable) {
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

            const outdated = reader.unread() || (discussion && normalizePostNumber(reader.last_read_post_number()) < normalizePostNumber(discussion.lastPostNumber()));

            let toolTipTranslationKey = 'last-read-at';

            if (discussion) {
                toolTipTranslationKey = outdated ? 'last-read-at-behind' : 'last-read-at-up-to-date';
            }

            return m('li.WhoRead-item', m(Tooltip, {
                text: extractText(app.translator.trans(translationPrefix + 'tooltip.' + toolTipTranslationKey, {
                    user,
                    ago: humanTime(reader.last_read_at()),
                })),
            }, m('.WhoRead-avatar', {
                className: outdated ? 'WhoRead-avatar--outdated' : '',
            }, [
                avatar(user),
                m('ul.badges', listItems(badges.toArray())),
            ])));
        }));
    }
}
