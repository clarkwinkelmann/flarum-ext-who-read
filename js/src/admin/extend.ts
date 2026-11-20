import app from 'flarum/admin/app';
import Extend from 'flarum/common/extenders';
import Group from 'flarum/common/models/Group';
import Switch from 'flarum/common/components/Switch';
import AdminPage from 'flarum/admin/components/AdminPage';

const settingsPrefix = 'who-read.';
const translationPrefix = 'clarkwinkelmann-who-read.admin.settings.';

export default [
    new Extend.Admin()
        .setting(() => ({
            setting: settingsPrefix + 'showInDiscussionList',
            type: 'switch',
            label: app.translator.trans(translationPrefix + 'show-in-discussion-list'),
        }))
        .setting(() => ({
            setting: settingsPrefix + 'showInHero',
            type: 'switch',
            label: app.translator.trans(translationPrefix + 'show-in-hero'),
        }))
        .setting(() => ({
            setting: settingsPrefix + 'showBetweenPosts',
            type: 'switch',
            label: app.translator.trans(translationPrefix + 'show-between-posts'),
        }))
        .setting(() => ({
            setting: settingsPrefix + 'showCountOfReadersWhoStopped',
            type: 'switch',
            label: app.translator.trans(translationPrefix + 'show-count-of-readers-who-stopped'),
        }))
        .setting(() => ({
            setting: settingsPrefix + 'hideWhenBehind',
            type: 'number',
            min: 0,
            label: app.translator.trans(translationPrefix + 'hide-when-behind'),
        }))
        .setting(() => ({
            setting: settingsPrefix + 'maxVisible', // TODO: default 10
            type: 'number',
            min: 0,
            label: app.translator.trans(translationPrefix + 'max-visible'),
        }))
        .setting(() => ({
            setting: settingsPrefix + 'unreadIcon',
            type: 'string',
            placeholder: 'fas fa-eye-dash',
            label: app.translator.trans(translationPrefix + 'unread-icon'),
        }))
        .setting(() => function (this: AdminPage) {
            const groupsValue = (this.setting(settingsPrefix + 'onlyGroups', '')() as string).split(',').filter(value => parseInt(value) > 0);

            return m('.Form-group', [
                m('label', app.translator.trans(translationPrefix + 'only-groups')),
                app.store.all<Group>('groups').filter(group => group.id() !== Group.MEMBER_ID && group.id() !== Group.GUEST_ID).map(group => Switch.component({
                    state: groupsValue.indexOf(group.id()!) !== -1,
                    onchange: (checked: boolean) => {
                        let newValue: string[];

                        if (checked) {
                            newValue = [
                                ...groupsValue,
                                group.id()!,
                            ];
                        } else {
                            newValue = groupsValue.filter(v => v !== group.id());
                        }

                        this.setting(settingsPrefix + 'onlyGroups')(newValue.join(','));
                    },
                }, group.nameSingular())),
            ]);
        })
        .permission(() => ({
            icon: 'fas fa-book-reader',
            label: app.translator.trans('clarkwinkelmann-who-read.admin.permissions.see-read'),
            permission: 'who-read.seeRead',
            allowGuest: true,
        }), 'view')
        .permission(() => ({
            icon: 'fas fa-book-reader',
            label: app.translator.trans('clarkwinkelmann-who-read.admin.permissions.see-subscription'),
            permission: 'who-read.seeSubscription',
            allowGuest: true,
        }), 'view')
        .permission(() => ({
            icon: 'fas fa-book-reader',
            label: app.translator.trans('clarkwinkelmann-who-read.admin.permissions.see-unread'),
            permission: 'who-read.seeUnread',
            allowGuest: true,
        }), 'view')
        .permission(() => ({
            icon: 'fas fa-book-reader',
            label: app.translator.trans('clarkwinkelmann-who-read.admin.permissions.mark-unread'),
            permission: 'who-read.markUnread',
        }), 'reply'),
];
