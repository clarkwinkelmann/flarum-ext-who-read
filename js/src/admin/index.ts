import app from 'flarum/admin/app';
import Switch from 'flarum/common/components/Switch';
import Group from 'flarum/common/models/Group';
import ExtensionPage from 'flarum/admin/components/ExtensionPage';

const settingsPrefix = 'who-read.';
const translationPrefix = 'clarkwinkelmann-who-read.admin.settings.';

app.initializers.add('clarkwinkelmann-who-read', () => {
    app.extensionData
        .for('clarkwinkelmann-who-read')
        .registerSetting(function (this: ExtensionPage) {
            const groupsValue = (this.setting(settingsPrefix + 'onlyGroups', '')() as string).split(',').filter(value => parseInt(value) > 0);

            return [
                m('.Form-group', [
                    Switch.component({
                        state: this.setting(settingsPrefix + 'showInDiscussionList', '1')() === '1',
                        onchange: (value: boolean) => {
                            this.setting(settingsPrefix + 'showInDiscussionList')(value ? '1' : '0');
                        },
                    }, app.translator.trans(translationPrefix + 'show-in-discussion-list')),
                ]),
                m('.Form-group', [
                    Switch.component({
                        state: this.setting(settingsPrefix + 'showInHero', '1')() === '1',
                        onchange: (value: boolean) => {
                            this.setting(settingsPrefix + 'showInHero')(value ? '1' : '0');
                        },
                    }, app.translator.trans(translationPrefix + 'show-in-hero')),
                ]),
                m('.Form-group', [
                    Switch.component({
                        state: this.setting(settingsPrefix + 'showBetweenPosts', '1')() === '1',
                        onchange: (value: boolean) => {
                            this.setting(settingsPrefix + 'showBetweenPosts')(value ? '1' : '0');
                        },
                    }, app.translator.trans(translationPrefix + 'show-between-posts')),
                ]),
                m('.Form-group', [
                    Switch.component({
                        state: this.setting(settingsPrefix + 'showCountOfReadersWhoStopped')() === '1',
                        onchange: (value: boolean) => {
                            this.setting(settingsPrefix + 'showCountOfReadersWhoStopped')(value ? '1' : '0');
                        },
                    }, app.translator.trans(translationPrefix + 'show-count-of-readers-who-stopped')),
                ]),
                m('.Form-group', [
                    m('label', app.translator.trans(translationPrefix + 'hide-when-behind')),
                    m('input.FormControl', {
                        type: 'number',
                        bidi: this.setting(settingsPrefix + 'hideWhenBehind'),
                        min: 0,
                    }),
                ]),
                m('.Form-group', [
                    m('label', app.translator.trans(translationPrefix + 'max-visible')),
                    m('input.FormControl', {
                        type: 'number',
                        bidi: this.setting(settingsPrefix + 'maxVisible', '10'),
                        min: 0,
                    }),
                ]),
                m('.Form-group', [
                    m('label', app.translator.trans(translationPrefix + 'unread-icon')),
                    m('input.FormControl', {
                        type: 'text',
                        bidi: this.setting(settingsPrefix + 'unreadIcon'),
                        placeholder: 'fas fa-eye-dash',
                    }),
                ]),
                m('.Form-group', [
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
                ]),
            ];
        })
        .registerPermission({
            icon: 'fas fa-book-reader',
            label: app.translator.trans('clarkwinkelmann-who-read.admin.permissions.see-read'),
            permission: 'who-read.seeRead',
            allowGuest: true,
        }, 'view')
        .registerPermission({
            icon: 'fas fa-book-reader',
            label: app.translator.trans('clarkwinkelmann-who-read.admin.permissions.see-subscription'),
            permission: 'who-read.seeSubscription',
            allowGuest: true,
        }, 'view')
        .registerPermission({
            icon: 'fas fa-book-reader',
            label: app.translator.trans('clarkwinkelmann-who-read.admin.permissions.see-unread'),
            permission: 'who-read.seeUnread',
            allowGuest: true,
        }, 'view')
        .registerPermission({
            icon: 'fas fa-book-reader',
            label: app.translator.trans('clarkwinkelmann-who-read.admin.permissions.mark-unread'),
            permission: 'who-read.markUnread',
        }, 'reply')
    ;
});
