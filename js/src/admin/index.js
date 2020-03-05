import {extend} from 'flarum/extend';
import app from 'flarum/app';
import WhoReadSettingsModal from './components/WhoReadSettingsModal';
import addPermissions from './addPermissions';

app.initializers.add('clarkwinkelmann-who-read', () => {
    app.extensionSettings['clarkwinkelmann-who-read'] = () => app.modal.show(new WhoReadSettingsModal());

    addPermissions();
});
