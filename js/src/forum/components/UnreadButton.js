import app from 'flarum/forum/app';
import Button from 'flarum/common/components/Button';

/* global m */

export default class UnreadButton {
    view(vnode) {
        const {discussion, className} = vnode.attrs;

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
