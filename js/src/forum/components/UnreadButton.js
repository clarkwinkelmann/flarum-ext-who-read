import app from 'flarum/app';
import Component from 'flarum/Component';
import Button from 'flarum/components/Button';

/* global m */

export default class UnreadButton extends Component {
    view() {
        const {discussion, className} = this.attrs;

        const unread = !!discussion.attribute('whoReadUnread');

        return Button.component({
            className,
            icon: app.forum.attribute('who-read.unreadIcon'),
            onclick() {
                discussion.save({
                    whoReadUnread: !unread,
                }).then(() => {
                    m.redraw();
                });
            },
        }, app.translator.trans('clarkwinkelmann-who-read.forum.controls.' + (unread ? 'remove' : 'set') + '-unread'));
    }
}
