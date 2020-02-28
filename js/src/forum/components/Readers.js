import app from 'flarum/app';
import Component from 'flarum/Component';
import username from 'flarum/helpers/username';
import avatar from 'flarum/helpers/avatar';
import Badge from 'flarum/components/Badge';
import userOnline from 'flarum/helpers/userOnline';
import listItems from 'flarum/helpers/listItems';
import icon from 'flarum/helpers/icon';
import extractText from 'flarum/utils/extractText';
import humanTime from 'flarum/utils/humanTime';

/* global m, $, flarum */

const translationPrefix = 'clarkwinkelmann-who-read.forum.';

export default class Readers extends Component {
    view() {
        const LIMIT = app.forum.attribute('who-read.maxVisible');

        const items = [];

        const readersWithoutThoseVeryBehind = this.props.readers.filter(reader => {
            if (!this.props.discussion) {
                return true;
            }

            const behindTreshold = app.forum.attribute('who-read.hideWhenBehind');

            if (!behindTreshold) {
                return true;
            }

            return reader.last_read_post_number() > this.props.discussion.lastPostNumber() - behindTreshold;
        });

        readersWithoutThoseVeryBehind.forEach((reader, index) => {
            if (!this.showAll) {
                if (index === LIMIT) {
                    const howManyMore = readersWithoutThoseVeryBehind.length - LIMIT;

                    items.push(m('span.Avatar.WhoRead-more', {
                        // Not using a tooltip here because it kind of breaks if a tooltip is open while Mithril redraws
                        title: extractText(app.translator.trans(translationPrefix + 'show-more', {
                            count: howManyMore,
                        })),
                        onclick: event => {
                            event.preventDefault();
                            this.showAll = true;
                        },
                    }, '+' + howManyMore));
                }

                if (index >= LIMIT) {
                    return;
                }
            }

            const user = reader.user();

            // Most likely this shouldn't happen, unless the database integrity is broken
            if (!user) {
                return;
            }

            const badges = user.badges();

            if (flarum.extensions['flarum-subscriptions']) {
                switch (reader.subscription()) {
                    case 'follow':
                        badges.add('subscriptions-follow', Badge.component({
                            label: app.translator.trans('flarum-subscriptions.forum.badge.following_tooltip'),
                            icon: 'fas fa-star',
                            type: 'following',
                        }));
                        break;
                    case 'ignore':
                        badges.add('subscriptions-ignoring', Badge.component({
                            label: app.translator.trans('flarum-subscriptions.forum.badge.ignoring_tooltip'),
                            icon: 'far fa-eye-slash',
                            type: 'ignoring',
                        }));
                        break;
                }
            }

            const outdated = this.props.discussion && reader.last_read_post_number() < this.props.discussion.lastPostNumber();

            let toolTipTranslationKey = 'last_read_at';

            if (this.props.discussion) {
                toolTipTranslationKey = outdated ? 'last_read_at_behind' : 'last_read_at_up_to_date';
            }

            items.push(m('a', {
                href: app.route.user(user),
                title: extractText(app.translator.trans(translationPrefix + 'tooltip.' + toolTipTranslationKey, {
                    user,
                    ago: humanTime(reader.last_read_at()),
                })),
                config(element) {
                    $(element).tooltip({placement: 'top'});
                    m.route.apply(this, arguments);
                },
            }, [
                m('.WhoRead-avatar', {
                    className: outdated ? 'WhoRead-avatar--outdated' : '',
                }, [
                    avatar(user),
                    this.props.extended ? m('ul.badges', listItems(badges.toArray())) : null,
                ]),
                this.props.extended ? m('.WhoRead-user', [
                    userOnline(user),
                    username(user),
                ]) : null,
            ]));
        });

        return m('.WhoRead', {
            className: this.props.extended ? 'WhoRead--extended' : '',
        }, [
            this.props.toggleable ? m('.WhoRead-toggle', {
                onclick: () => {
                    this.visible = !this.visible;
                },
            }, icon('fas fa-chevron-' + (this.visible ? 'up' : 'down'))) : null,
            this.props.title ? m('h3', {
                onclick: () => {
                    this.visible = !this.visible;
                },
            }, this.props.title) : null,
            !this.props.toggleable || this.visible ? m('ul.WhoRead-list', items.map(item => m('li.WhoRead-item', item))) : null,
        ]);
    }
}
