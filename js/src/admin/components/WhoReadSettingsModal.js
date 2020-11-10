import app from 'flarum/app';
import SettingsModal from 'flarum/components/SettingsModal';
import Switch from 'flarum/components/Switch';
import Group from 'flarum/models/Group';

/* global m */

const settingsPrefix = 'who-read.';
const translationPrefix = 'clarkwinkelmann-who-read.admin.settings.';

export default class WhoReadSettingsModal extends SettingsModal {
    title() {
        return app.translator.trans(translationPrefix + 'title');
    }

    form() {
        const groupsValue = this.setting(settingsPrefix + 'onlyGroups', '')().split(',').filter(value => value > 0);

        return [
            m('.Form-group', [
                Switch.component({
                    state: this.setting(settingsPrefix + 'showInDiscussionList', '1')() === '1',
                    onchange: value => {
                        this.setting(settingsPrefix + 'showInDiscussionList')(value ? '1' : '0');
                    },
                }, app.translator.trans(translationPrefix + 'show-in-discussion-list')),
            ]),
            m('.Form-group', [
                Switch.component({
                    state: this.setting(settingsPrefix + 'showInHero', '1')() === '1',
                    onchange: value => {
                        this.setting(settingsPrefix + 'showInHero')(value ? '1' : '0');
                    },
                }, app.translator.trans(translationPrefix + 'show-in-hero')),
            ]),
            m('.Form-group', [
                Switch.component({
                    state: this.setting(settingsPrefix + 'showBetweenPosts', '1')() === '1',
                    onchange: value => {
                        this.setting(settingsPrefix + 'showBetweenPosts')(value ? '1' : '0');
                    },
                }, app.translator.trans(translationPrefix + 'show-between-posts')),
            ]),
            m('.Form-group', [
                Switch.component({
                    state: this.setting(settingsPrefix + 'showCountOfReadersWhoStopped')() === '1',
                    onchange: value => {
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
                    bidi: this.setting(settingsPrefix + 'maxVisible', 10),
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
                app.store.all('groups').filter(group => group.id() !== Group.MEMBER_ID && group.id() !== Group.GUEST_ID).map(group => Switch.component({
                    state: groupsValue.indexOf(group.id()) !== -1,
                    onchange: checked => {
                        let newValue = [];

                        if (checked) {
                            newValue = [
                                ...groupsValue,
                                group.id(),
                            ];
                        } else {
                            newValue = groupsValue.filter(v => v !== group.id());
                        }

                        this.setting(settingsPrefix + 'onlyGroups')(newValue.join(','));
                    },
                }, group.nameSingular())),
            ]),
        ];
    }
}
