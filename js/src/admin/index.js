import {extend} from 'flarum/extend';
import app from 'flarum/app';
import WhoReadSettingsModal from './components/WhoReadSettingsModal';
import PermissionGrid from 'flarum/components/PermissionGrid';

app.initializers.add('clarkwinkelmann-who-read', () => {
    app.extensionSettings['clarkwinkelmann-who-read'] = () => app.modal.show(new WhoReadSettingsModal());

    extend(PermissionGrid.prototype, 'moderateItems', items => {
        items.add('clarkwinkelmann-who-read-read', {
            icon: 'fas fa-book-reader',
            label: app.translator.trans('clarkwinkelmann-who-read.admin.permissions.see-read'),
            permission: 'who-read.seeRead',
            allowGuest: true,
        });

        items.add('clarkwinkelmann-who-read-subscription', {
            icon: 'fas fa-book-reader',
            label: app.translator.trans('clarkwinkelmann-who-read.admin.permissions.see-subscription'),
            permission: 'who-read.seeSubscription',
            allowGuest: true,
        });
    });
});
