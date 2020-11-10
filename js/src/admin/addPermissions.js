import {extend} from 'flarum/extend';
import app from 'flarum/app';
import PermissionGrid from 'flarum/components/PermissionGrid';
import ItemList from 'flarum/utils/ItemList';

const translationPrefix = 'clarkwinkelmann-who-read.admin.permissions.';

export default function () {
    extend(PermissionGrid.prototype, 'permissionItems', permissionGroups => {
        const items = new ItemList();

        items.add('see-read', {
            icon: 'fas fa-book-reader',
            label: app.translator.trans(translationPrefix + 'see-read'),
            permission: 'who-read.seeRead',
            allowGuest: true,
        });

        items.add('see-subscription', {
            icon: 'fas fa-book-reader',
            label: app.translator.trans(translationPrefix + 'see-subscription'),
            permission: 'who-read.seeSubscription',
            allowGuest: true,
        });

        items.add('see-unread', {
            icon: 'fas fa-book-reader',
            label: app.translator.trans(translationPrefix + 'see-unread'),
            permission: 'who-read.seeUnread',
            allowGuest: true,
        });

        items.add('mark-unread', {
            icon: 'fas fa-book-reader',
            label: app.translator.trans(translationPrefix + 'mark-unread'),
            permission: 'who-read.markUnread',
        });

        permissionGroups.add('clarkwinkelmann-who-read', {
            label: app.translator.trans(translationPrefix + 'heading'),
            children: items.toArray(),
        });
    });
}
